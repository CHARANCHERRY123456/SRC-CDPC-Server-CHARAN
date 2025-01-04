import mongoose from 'mongoose';
const resourceSchema = new mongoose.Schema({
    name: String,
    url: String,
    image: String,
    description: String,
});

const Resource = mongoose.model("Resource", resourceSchema);
export default Resource;