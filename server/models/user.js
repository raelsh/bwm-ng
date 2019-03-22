const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        min: [4, 'Texto muy corto, min. 4 caracteres'],
        max: [32, 'Texto muy largo, max. 32 caracteres']
    },
    email: {
        type: String,
        min: [4, 'Texto muy corto, min. 4 caracteres'],
        max: [32, 'Texto muy largo, max. 32 caracteres'],
        unique: true,
        lowercase: true,
        required: 'Email es requerido',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        min: [4, 'Texto muy corto, min. 4 caracteres'],
        max: [32, 'Texto muy largo, max. 32 caracteres'],
        required: 'Contraseña requerida'
    },
    rentals: [{ type: Schema.Types.ObjectId, ref: 'Rental' }]
});

userSchema.methods.hasSamePassword=function(reqPass){
    return bcrypt.compareSync(reqPass, this.password);
}

userSchema.pre('save', function (next) {
    const user = this;
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
            user.password = hash;
            next();
        });
    });
});
module.exports = mongoose.model('User', userSchema);