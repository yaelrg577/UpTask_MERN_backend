import mongosoe from "mongoose"

const proyectosSchema = mongosoe.Schema({
    nombre : {
        type : String, 
        trim: true, 
        require: true,
    }, 
    descripcion: {
        type: String, 
        trim: true, 
        require: true, 
    }, 
    fechaEntrega : {
        type: Date, 
        default: Date.now(),
    },
    cliente : {
        type: String, 
        trim: true, 
        require: true,
    },
    creador : {
        type: mongosoe.Schema.Types.ObjectId,
        ref: "Usuario",
    },
    tareas : [
        {
            type: mongosoe.Schema.Types.ObjectId,
            ref: "Tarea",

        },
    ],
    colaboradores : [
        {
            type: mongosoe.Schema.Types.ObjectId,
            ref: "Usuario", 
        },
    ],

},{
    timestamps: true
})

const Proyecto = mongosoe.model("Proyecto", proyectosSchema)
export default Proyecto