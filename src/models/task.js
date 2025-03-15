const connectDB = require('../config/db');
const { ObjectId } = require('mongodb')
const client = require('../config/redis')
const { collection } = require('../constant');
const { ErrorHandler } = require('../middleware/errorHandler');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs')
const axios = require('axios')

const TASKS = collection.COLLECTION1;
const USERS = collection.COLLECTION2;

async function createTask(token, task, description, status) {
    await client.del(`tasks:${token}`)
    const db = await connectDB();
    const collection = db.collection(TASKS)
    return await collection.insertOne({
        token: new ObjectId(token),
        task,
        description,
        status,
        createdAt: new Date(),
        updatedAt: new Date()
    });
}

async function getTaskById(taskId) {
    const db = await connectDB();
    const collection = await db.collection(TASKS);
    const result = await collection.findOne({ _id: new ObjectId(taskId) })
    return result;
}

// async function getTasksByUser(filter, data) {
//     const db = await connectDB();
//     const page = data.page;
//     const limit = data.limit;
//     let skip = (page - 1) * limit;
//     let filterr={};
//     if(data.status){
//         filterr.status=data.status
//     }
//     if(data.task){
//         filterr.task=data.task
//     }
//     const collection = await db.collection(TASKS)
//     const collection3 = await db.collection(USERS)
//     // const cachedData = await client.get(JSON.stringify(filter));
//     // // console.log("data",cachedData);
//     // if (cachedData) {
//     //     return JSON.parse(cachedData);
//     // }
//     const tasks = await collection.find({
//         ...filterr
//     }).skip(skip).limit(limit).toArray();


//     const user = await collection3.findOne({ _id: new ObjectId(filter.token) }, { projection: { password: 0 } });
//     // await client.setex(JSON.stringify({ ...filter, ...data }), 600, JSON.stringify({ tasks, user }))
//     return { tasks, user };
// }

async function getTasksByUser({ token, task, status, page, limit }) {
    const db = await connectDB();
    const skip = (page - 1) * limit;

    let query = { status: { $ne: "deleted" } }; 

    if (status) {
        query["status"] = status;
    }
    if (task) {
        query["task"] = { $regex: task, $options: "i" }; 
    }
    if (token) {
        query.token = new ObjectId(token);
    }

    const cachedData = await client.get(JSON.stringify({ token, task, status, page, limit }));

    // console.log("data",cachedData);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const collection = db.collection(TASKS);
    const collection3 = db.collection(USERS);

    // Fetch tasks with applied filters and pagination
    const tasks = await collection.find(query).skip(skip).limit(limit).toArray();

    // Fetch user details
    let user = null;
    if (token) {
        user = await collection3.findOne(
            { _id: new ObjectId(token) },
            { projection: { password: 0 } }
        );
    }
    await client.setex(JSON.stringify({ token, task, status, page, limit }), 600, JSON.stringify({ tasks, user }))
    return { tasks, user };
}


async function getAllTasks(data) {
    const db = await connectDB();
    const page = parseInt(data.page) || 1;
    const limit = parseInt(data.limit) || 10;
    const skip = (page - 1) * limit;

    let taskFilter = {};
    let userFilter = {}; 

    if (data.status) {
        taskFilter["status"] = data.status;
    }
    if (data.task) {
        taskFilter["task"] = { $regex: data.task, $options: "i" };
    }

    if (data.username) {
        userFilter["user.username"] = { $regex: data.username, $options: "i" };
    }
    if (data.email) {
        userFilter["user.email"] = { $regex: data.email, $options: "i" };
    }
    if (data.role) {
        userFilter["user.role"] = data.role;
    }
    const collection = db.collection("tasks");
    const cacheKey = `tasks:${JSON.stringify({ ...taskFilter, ...userFilter, page, limit })}`;
    const cachedData = await client.get(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const tasks = await collection.aggregate([
        {
            $match: taskFilter 
        },
        {
            $lookup: {
                from: "login_details",
                localField: "token",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: "$user" }, 
        {
            $match: userFilter
        },
        {
            $project: {
                "user.password": 0,
                "user.createdAt": 0,
                "user.updatedAt": 0
            }
        },
        { $skip: skip },
        { $limit: limit }
    ]).toArray();
    await client.setex(cacheKey, 600, JSON.stringify({ tasks, message: "Tasks fetched successfully" }));

    return { tasks };
}




async function updateTaskStatus(taskId, status, token) {
    const db = await connectDB();
    await client.del(`tasks:${token}`)
    const collection = await db.collection(TASKS)
    return await collection.updateOne(
        { _id: new ObjectId(taskId) },
        { $set: { status } }
    );
}

async function deleteTask(taskId, token) {
    await client.del(`tasks:${token}`)
    const db = await connectDB();
    const collection = await db.collection(TASKS)
    const entry = await collection.findOneAndUpdate(
        {
            _id: ObjectId(taskId),
            status: { $ne: "deleted" },
        },
        { $set: { status: "deleted", updated_at: new Date() } },
        { returnDocument: "after" }
    );
    if (!entry.value) throw new ErrorHandler(StatusCodes.NOT_FOUND, "DMS_VE0", "task not found");
}

async function hardDelete(delay, batchSize){
    const db= await connectDB();
    const fsPath = './deleteTask.json';

    if(!fs.existsSync(fsPath)){
        fs.writeFileSync(fsPath, "[]");
    }

    while(true){
        const task = await db.collection(TASKS).find({status: "deleted"}).limit(batchSize).toArray();

        if(!task.length) break;
        const Ids= task.map((t)=> t._id);
        const {deletedCount}= await db.collection(TASKS).deleteMany({
            _id : { $in: Ids},
        })

        const data = JSON.parse(fs.readFileSync(fsPath,"utf8"));
        data.push(...task);
        fs.writeFileSync(fsPath, JSON.stringify(data, null, 2));

        await axios.post(
            'https://chat.googleapis.com/v1/spaces/AAAAKceR3IQ/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=iZ8dIK-MIqkFPOO6omMwGVjqZvnk6TQzj-ARLvxINP0',
            {
                text:JSON.stringify(
                    {
                        deleteCount: deletedCount ,
                        deleteId : Ids ,
                        intern_name: "Aviral"
                    }
                )
            }
        )
        await new Promise((res)=> setTimeout(res, delay))
    };

    
}

module.exports = {
    createTask,
    getTasksByUser,
    updateTaskStatus,
    deleteTask,
    getTaskById,
    getAllTasks,
    hardDelete
};
//user_id, fos_id : snake casing