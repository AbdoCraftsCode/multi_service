

export const create = async ({ model, data = {} } = {}) => {
    const document = await model.create(data);
    return document;
};

// 2. Read
export const findAll = async ({ model, filter = {}, select = "", populate = [], skip = 0, limit = 1000 } = {}) => {
    const documents = await model.find(filter)
        .select(select)
        .populate(populate)
        .skip(skip)
        .limit(limit);
    return documents;
};

export const findById = async ({ model, id = "", select = "", populate = [] } = {}) => {
    const document = await model.findById(id)
        .select(select)
        .populate(populate);
    return document;
};

export const findOne = async ({ model, filter = {}, select = "", populate = [] } = {}) => {
    const document = await model.findOne(filter)
        .select(select)
        .populate(populate);
    return document;
};

// 3. Update
export const findOneAndUpdate = async ({ model, filter = {}, data = {}, options = {}, select = "", populate = [] } = {}) => {
    const document = await model.findOneAndUpdate(filter, data, options)
        .select(select)
        .populate(populate);
    return document;
};

export const findByIdAndUpdate = async ({ model, id = "", data = {}, options = {}, select = "", populate = [] } = {}) => {
    const document = await model.findByIdAndUpdate(id, data, options)
        .select(select)
        .populate(populate);
    return document;
};

export const updateOne = async ({ model, filter = {}, data = {}, options = {} } = {}) => {
    const result = await model.updateOne(filter, data, options);
    return result;
};

// 4. Delete
export const deleteOne = async ({ model, filter = {} } = {}) => {
    const result = await model.deleteOne(filter);
    return result;
};

export const deleteMany = async ({ model, filter = {} } = {}) => {
    const result = await model.deleteMany(filter);
    return result;
};

// 5. Additional Operations
export const countDocuments = async ({ model, filter = {} } = {}) => {
    const count = await model.countDocuments(filter);
    return count;
};

export const aggregate = async ({ model, pipeline = [] } = {}) => {
    const result = await model.aggregate(pipeline);
    return result;
};