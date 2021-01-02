import validator from 'express-validator'
const { check, validationResult } = validator;

export const productValidationRules = () => {
    return [
        check('title','Product title must be provided').notEmpty(),
        check('price','Product price must be provided').notEmpty(),
        check('desc','Product description must be provided').notEmpty()
    ];
};

export const validate =(req,res,next) => {
    const errors = validationResult(req);
    if(errors.isEmpty()){
        return next();
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push(err.msg))

    console.log(extractedErrors);

    extractedErrors.forEach(error => {
        req.flash('error',error);
    });

    res.redirect('back');
};