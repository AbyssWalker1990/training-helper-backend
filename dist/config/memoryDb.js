"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUp = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
mongoose_1.default.set('strictQuery', false);
// let mongo = undefined
const setUp = async () => {
    const mongo = await mongodb_memory_server_1.MongoMemoryServer.create();
    const url = mongo.getUri();
    await mongoose_1.default.connect(url, { dbName: 'test' });
};
exports.setUp = setUp;
// export const dropDatabase = async (): Promise<void> => {
//   if (mongo !== undefined) {
//     await mongoose.connection.dropDatabase()
//     await mongoose.connection.close()
//     await mongo.stop()
//   }
// };
// export const dropCollections = async (): Promise<void> => {
//   if (mongo) {
//     const collections = mongoose.connection.collections
//     for (const key in collections) {
//       const collection = collections[key]
//       await collection.deleteMany()
//     }
//   }
// }
