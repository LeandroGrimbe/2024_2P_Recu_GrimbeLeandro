class Persona
{
    constructor(id, nombre, apellido, fechaNacimiento)
    {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
    }

    toString()
    {
        return `id: ${this.id}, nombre: ${this.nombre}, apellido: ${this.apellido}, fechaNacimiento: ${this.fechaNacimiento},`;
    }
}

class Ciudadano extends Persona
{
    constructor(id, nombre, apellido, fechaNacimiento, dni)
    {
        super(id, nombre, apellido, fechaNacimiento);
        this.dni = dni;
    }

    toString() 
    {
        return `ciudadano: ` + super.toString() + `dni: ${this.dni}`;
    }
}

class Extranjero extends Persona
{
    constructor(id, nombre, apellido, fechaNacimiento, paisOrigen)
    {
        super(id, nombre, apellido, fechaNacimiento);
        this.paisOrigen = paisOrigen;
    }

    toString()
    {
        return  `extranjero: ` + super.toString() + `paisOrigen: ${this.paisOrigen}`;
    }
}
