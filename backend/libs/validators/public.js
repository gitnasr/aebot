const Joi = require("joi");
const FetcherIdValidator = {
    body:{
        id: Joi.string().required().trim()
    }
}

const OperationIdValidator = {
    params:{
        operation: Joi.string().required().trim().alphanum().min(5).lowercase().message("رقم العملية غير صحيح!")
    }
}

module.exports = {
    FetcherIdValidator,
    OperationIdValidator
}