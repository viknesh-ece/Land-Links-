import { MongoClient, ObjectId } from "mongodb";
import fs from "fs";
import path from "path";

const MONGODB_URI = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/landlinkx?directConnection=true";

let client;
let dbPromise;

function getDb() {
    if (!dbPromise) {
        client = new MongoClient(MONGODB_URI);
        dbPromise = client.connect().then(c => c.db("landlinkx")).catch(err => {
            console.error("MongoDB Connection Error:", err);
            return null;
        });
    }
    return dbPromise;
}

// Convert MongoDB document _id (ObjectId) to string id for frontend compatibility
function formatDoc(doc) {
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return {
        id: _id ? _id.toString() : doc.id,
        ...rest
    };
}

function parseId(idStr) {
    if (!idStr) return null;
    try {
        if (ObjectId.isValid(idStr)) {
            return new ObjectId(idStr);
        }
    } catch (e) {}
    return idStr;
}

// Direct MongoDB Real-Time Storage Layer
export const prisma = {
    user: {
        async findUnique({ where }) {
            const db = await getDb();
            if (db) {
                let query = {};
                if (where.email) query.email = where.email;
                if (where.id) query._id = parseId(where.id);
                
                const doc = await db.collection("User").findOne(query);
                if (doc) return formatDoc(doc);
            }
            return null;
        },
        async create({ data: input }) {
            const db = await getDb();
            const newDoc = {
                _id: new ObjectId(),
                name: input.name,
                email: input.email,
                password: input.password,
                role: input.role,
                verified: false,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            if (db) {
                await db.collection("User").insertOne(newDoc);
            }
            return formatDoc(newDoc);
        },
        async update({ where, data: input }) {
            const db = await getDb();
            const filter = { _id: parseId(where.id) };
            const updateDoc = { ...input, updatedAt: new Date() };
            if (db) {
                await db.collection("User").updateOne(filter, { $set: updateDoc });
                const updated = await db.collection("User").findOne(filter);
                return formatDoc(updated);
            }
            return null;
        }
    },
    property: {
        async findMany() {
            const db = await getDb();
            if (db) {
                const docs = await db.collection("Property").find({}).toArray();
                return docs.map(formatDoc);
            }
            return [];
        },
        async create({ data: input }) {
            const db = await getDb();
            const newDoc = {
                _id: new ObjectId(),
                title: input.title || "Untitled Property",
                description: input.description || "",
                price: Number(input.price) || 0,
                location: input.location || "",
                image: input.image || "placeholder.jpg",
                soilReport: input.soilReport || null,
                landDeed: input.landDeed || null,
                pattaDocument: input.pattaDocument || null,
                gisCoordinates: input.gisCoordinates || null,
                createdAt: new Date()
            };
            if (db) {
                await db.collection("Property").insertOne(newDoc);
            }
            return formatDoc(newDoc);
        },
        async delete({ where }) {
            const db = await getDb();
            if (db) {
                await db.collection("Property").deleteOne({ _id: parseId(where.id) });
            }
            return { id: where.id };
        },
        async update({ where, data: input }) {
            const db = await getDb();
            const filter = { _id: parseId(where.id) };
            if (db) {
                await db.collection("Property").updateOne(filter, { $set: input });
                const updated = await db.collection("Property").findOne(filter);
                return formatDoc(updated);
            }
            return null;
        }
    },
    inboxThread: {
        async findMany({ where }) {
            const db = await getDb();
            if (db) {
                let query = {};
                if (where && where.userId) query.userId = where.userId;
                const docs = await db.collection("InboxThread").find(query).sort({ createdAt: -1 }).toArray();
                return docs.map(formatDoc);
            }
            return [];
        },
        async findFirst({ where }) {
            const db = await getDb();
            if (db) {
                let query = {};
                if (where.userId) query.userId = where.userId;
                if (where.propertyName) query.propertyName = where.propertyName;
                const doc = await db.collection("InboxThread").findOne(query);
                if (doc) return formatDoc(doc);
            }
            return null;
        },
        async create({ data: input }) {
            const db = await getDb();
            const newDoc = {
                _id: new ObjectId(),
                name: input.name,
                role: input.role,
                propertyName: input.propertyName,
                propertyPrice: Number(input.propertyPrice),
                location: input.location,
                lastMessage: input.lastMessage || "",
                unread: !!input.unread,
                status: input.status || "pending",
                myOffer: Number(input.myOffer || 0),
                counterOffer: input.counterOffer ? Number(input.counterOffer) : null,
                userId: input.userId,
                createdAt: new Date()
            };
            if (db) {
                await db.collection("InboxThread").insertOne(newDoc);
            }
            return formatDoc(newDoc);
        },
        async update({ where, data: input }) {
            const db = await getDb();
            const filter = { _id: parseId(where.id) };
            if (db) {
                await db.collection("InboxThread").updateOne(filter, { $set: input });
                const updated = await db.collection("InboxThread").findOne(filter);
                return formatDoc(updated);
            }
            return null;
        }
    },
    message: {
        async findMany({ where }) {
            const db = await getDb();
            if (db) {
                let query = {};
                if (where && where.threadId) query.threadId = where.threadId;
                const docs = await db.collection("Message").find(query).sort({ createdAt: 1 }).toArray();
                return docs.map(formatDoc);
            }
            return [];
        },
        async create({ data: input }) {
            const db = await getDb();
            const newDoc = {
                _id: new ObjectId(),
                threadId: input.threadId,
                sender: input.sender,
                text: input.text,
                time: input.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                system: !!input.system,
                createdAt: new Date()
            };
            if (db) {
                await db.collection("Message").insertOne(newDoc);
            }
            return formatDoc(newDoc);
        },
        async createMany({ data: inputs }) {
            const db = await getDb();
            const docs = inputs.map(input => ({
                _id: new ObjectId(),
                threadId: input.threadId,
                sender: input.sender,
                text: input.text,
                time: input.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                system: !!input.system,
                createdAt: new Date()
            }));
            if (db) {
                await db.collection("Message").insertMany(docs);
            }
            return { count: docs.length };
        }
    }
};


