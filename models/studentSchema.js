const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const studentInformationSchema = mongoose.Schema({
    firstName:{
        type: String,
        require: true,
    },
    lastName:{
        type: String,
        require: true,
    },
    studentId:{
        type: Number,
        require: true,
        unique: true, 
    },
    email:{
        type: String,
        require: true,
    },
    password:{
        type: String,
        require: true,
    },
    phone:{
        type: String,
        require: true,
    },
    gender:{
        type: String,
        require: true,
    },
    department:{
        type: String,
        require: true,
    },
    batch:{
        type: Number,
        require: true,
    },
    registrationDate:{
        type:Date,
        default:Date.now,
    },
    savedPosts:[{                               //ja ja post save korbe kono user sei protita post er collection er id ekhane save rakhbo jate future a khuje bar korte pari j kon user kon kon post save korecilo 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostShare'   //jehetu post share collection er _id save rakhbo ei collection a tai eita forein-key hisebe use hobe
    }],
    sharedPosts:[{
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'PostShare'
    }],
    tokens:[{                              //jotobar e kono user login korbe je kono device theke , prottek login er jonno tar authentication token ekhane store hobe 
        token:{
            type: String
        }
    }]
});

//generating token here while a student is signing in or loging in          
studentInformationSchema.methods.generateToken= async function (){
    const studentToken = jwt.sign({_id: this._id.toString()},process.env.SECRET_KEY,{expiresIn: '30 minute'})

    this.tokens.push({token:studentToken});

    await this.save();

    return studentToken;
}

const Model = mongoose.model("StudentInformation",studentInformationSchema)

module.exports = Model;