const apiUrl = "https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero";

function MostrarSpinner() 
{
    document.getElementById("spinner").style.display = "block";
    document.getElementById("spinnerContainer").style.display = "flex";
}

function OcultarSpinner() 
{
    document.getElementById("spinner").style.display = "none";
    document.getElementById("spinnerContainer").style.display = "none";
}

function ListadoPersonas() 
{
    MostrarSpinner();
    const xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl, true);
    xhr.onreadystatechange = function () 
    {
        if(xhr.readyState == 4 && xhr.status == 200) 
        {   
            listadoPersonas = JSON.parse(xhr.responseText);
            CargarFilas();
            OcultarSpinner(); 
        }
    };
    xhr.send();
}

function CargarFilas() 
{
    const tbody = document.getElementById("TablaPersonas").getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    listadoPersonas.forEach(persona => 
    {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${persona.id}</td>
            <td>${persona.nombre}</td>
            <td>${persona.apellido}</td>
            <td>${persona.fechaNacimiento}</td>
            <td>${persona.dni || "N/A"}</td>
            <td>${persona.paisOrigen || "N/A"}</td>
            <td><button class="btnModify" onclick="EditarPersona(${persona.id})">Modificar</button></td>         
            <td><button class="btnDelete" onclick="AbrirFormBorrado(${persona.id})">Eliminar</button></td>
            `;
        tbody.appendChild(tr);
    });
}

function MostrarFormAlta() 
{
    RestablecerABM();
    Array.from(document.querySelectorAll("#FormularioABM input, #FormularioABM select")).forEach(element => 
    {
        element.readOnly = false;
        element.disabled = false;
    });
    document.getElementById("IdABM").setAttribute("readonly", true);
    document.getElementById("IdABM").setAttribute("disabled", true);
    document.getElementById("FormularioABM").style.display = "block";
    document.getElementById("FormularioLista").style.display = "none";

    document.getElementById("BotonAceptar").style.display = "inline";
    document.getElementById("BotonConfirmBaja").style.display = "none";
}

function MostrarAtributosPorTipo(tipo) 
{
    if(tipo === "Ciudadano") 
    {
        document.getElementById("Ciudadano").style.display = "block";
        document.getElementById("Extranjero").style.display = "none";
    } 
    else if(tipo === "Extranjero")
    {
        document.getElementById("Ciudadano").style.display = "none";
        document.getElementById("Extranjero").style.display = "block";
    }
}

function LeerDatosAlta() 
{
    const id = document.getElementById("IdABM").value;
    const nombre = document.getElementById("NombreABM").value;
    const apellido = document.getElementById("ApellidoABM").value;
    const fechaNacimiento = document.getElementById("FechaNacimientoABM").value;
    const tipo = document.getElementById("TipoPersonaSelect").value;
    let persona;

    if(tipo === "Ciudadano") 
    {
        const dni = document.getElementById("DniABM").value;
        persona = id ? new Ciudadano(id, nombre, apellido, fechaNacimiento, dni) : new Ciudadano(null, nombre, apellido, fechaNacimiento, dni);
    } 
    else 
    {
        const paisOrigen = document.getElementById("PaisOrigenABM").value;
        persona = id ? new Extranjero(id, nombre, apellido, fechaNacimiento, paisOrigen) : new Extranjero(null, nombre, apellido, fechaNacimiento, paisOrigen);
    }

    if(!persona.id) 
    {
        delete persona.id;
    }
    return persona;
}

function ValidacionAlta(persona) 
{
    datosValidos = true;

    if(persona.nombre !== undefined) 
    {
        if(!persona.nombre || persona.nombre == "") 
        {   
            alert("Nombre vacio o invalido, no se realizaron cambios..");
            datosValidos = false;
        }
    }

    if(persona.apellido !== undefined) 
    {
        if(!persona.apellido || persona.apellido == "") 
        {
            alert("Apellido vacio o invalido, no se realizaron cambios..");
            datosValidos = false;
        }   
    }
    
    if(persona.fechaNacimiento !== undefined) 
    {
        const dateObj = new Date();
        const mes = dateObj.getUTCMonth() + 1;
        const dia = dateObj.getUTCDate();
        const anio = dateObj.getUTCFullYear();

        fechaActual = anio + "" + mes + "" + dia;

        if(!persona.fechaNacimiento || persona.fechaNacimiento < 19000101 || persona.fechaNacimiento > fechaActual) 
        {
            alert("Fecha de nacimiento vacia o invalida (debe ser mayor al 1900 y menor a la fecha actual), no se realizaron cambios..");
            datosValidos = false;
        }
    }
    

    if(persona.dni !== undefined) 
    {
        if(!persona.dni || isNaN(persona.dni) || persona.dni.toString().length > 8 || persona.dni.toString().length < 6) 
        {   
            alert("DNI vacio o invalido (debe ser de entre 6 y 8 digitos), no se realizaron cambios..");
            datosValidos = false; 
        }
    }

    if(persona.paisOrigen !== undefined) 
    {
        if(!persona.paisOrigen)  
        {
            alert("Pais de Origen vacio o invalido, no se realizaron cambios..");
            datosValidos = false;
        }
    }

    return datosValidos;
}

function ConfirmarAlta() 
{
    const nuevaPersona = LeerDatosAlta();
    if(nuevaPersona) 
    {
        if(!ValidacionAlta(nuevaPersona)) 
        {
            return;
        }
        if(nuevaPersona.id) 
        {
            ModificarPersona(nuevaPersona);
        }
        else
        {
            AgregarPersona(nuevaPersona);
        }
    }
}

async function AgregarPersona(persona) 
{
    MostrarSpinner();
    try
    {
        const respuesta = await fetch(apiUrl,
        {
            method: "POST",
            headers:
            {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify(persona)
        });

        if(respuesta.ok) 
        {
            const data = await respuesta.json();
            persona.id = data.id;
            listadoPersonas.push(persona);
            CargarFilas();
            OcultarABM();
        }
        else
        {
            const mensajeError = await respuesta.text();
            throw new Error(`Hubo errores al guardar la persona, no se realizaron cambios. Error: ${respuesta.status} ${mensajeError}`);
        }
    } 
    catch(error) 
    {
        console.error(error);
    }
    finally 
    {
        OcultarSpinner();
    }
}

function ModificarPersona(persona) 
{
    MostrarSpinner();
    fetch(apiUrl, 
    {
        method: "PUT",
        headers: 
        {
            "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(persona)
    })
    .then(respuesta => 
    {
        if(respuesta.ok) 
        {
            return respuesta.text();
        }
        else 
        {
            throw new Error(`Hubo errores al modificar la persona, no se realizaron cambios. Error: ${respuesta.status}`);
        }
    })
    .then(data => 
    {
        console.log(data);
        const indice = listadoPersonas.findIndex(v => v.id.toString() == persona.id.toString());
        if(indice !== -1) 
        {
            listadoPersonas[indice] = persona;
        }
        CargarFilas();
        OcultarABM();
    })
    .catch(error => 
    {
        alert(error.message);
        OcultarABM();
    })
    .finally(() => 
    {
        OcultarSpinner();
    });
}

function EditarPersona(id) 
{
    HeaderForm("Modificacion");
    const persona = listadoPersonas.find(v => v.id.toString() == id.toString());
    if(!persona)
    {
        return;
    }

    document.getElementById("IdABM").value = persona.id;
    document.getElementById("NombreABM").value = persona.nombre;
    document.getElementById("ApellidoABM").value = persona.apellido;
    document.getElementById("FechaNacimientoABM").value = persona.fechaNacimiento;

    document.getElementById("BotonAceptar").style.display = "inline";
    document.getElementById("BotonConfirmBaja").style.display = "none";

    Array.from(document.querySelectorAll("#FormularioABM input, #FormularioABM select")).forEach(element => 
    {
        element.readOnly = false;
        element.disabled = false;
    });

    document.getElementById("TipoPersonaSelect").setAttribute("readonly",true)
    document.getElementById("TipoPersonaSelect").setAttribute("disabled", true);
    document.getElementById("IdABM").setAttribute("readonly",true);
    document.getElementById("IdABM").setAttribute("disabled",true);
    
    if(persona.dni !== undefined) 
    {
        document.getElementById("TipoPersonaSelect").value = "Ciudadano";
        document.getElementById("DniABM").value = persona.dni;
        document.getElementById("Ciudadano").style.display = "block";
        document.getElementById("Extranjero").style.display = "none";
    } 
    else 
    {
        document.getElementById("TipoPersonaSelect").value = "Extranjero";
        document.getElementById("PaisOrigenABM").value = persona.paisOrigen;
        document.getElementById("Ciudadano").style.display = "none";
        document.getElementById("Extranjero").style.display = "block";
    }

    document.getElementById("FormularioABM").style.display = "block";
    document.getElementById("FormularioLista").style.display = "none";
}

function AbrirFormBorrado(id) 
{
    HeaderForm("Baja");
    const persona = listadoPersonas.find(p => p.id.toString() == id.toString());
    if(!persona)
    {
        return;
    }

    document.getElementById("IdABM").value = persona.id;
    document.getElementById("NombreABM").value = persona.nombre;
    document.getElementById("ApellidoABM").value = persona.apellido;
    document.getElementById("FechaNacimientoABM").value = persona.fechaNacimiento;

    Array.from(document.querySelectorAll("#FormularioABM input, #FormularioABM select")).forEach(element => 
    {
        element.readOnly = true;
        element.disabled = true;
    });

    if(persona.dni !== undefined) 
    {
        document.getElementById("TipoPersonaSelect").value = "Ciudadano";
        document.getElementById("DniABM").value = persona.dni;
        document.getElementById("Ciudadano").style.display = "block";
        document.getElementById("Extranjero").style.display = "none";
    } 
    else 
    {
        document.getElementById("TipoPersonaSelect").value = "Extranjero";
        document.getElementById("PaisOrigenABM").value = persona.paisOrigen;
        document.getElementById("Ciudadano").style.display = "none";
        document.getElementById("Extranjero").style.display = "block";
    }

    document.getElementById("BotonAceptar").style.display = "none";
    document.getElementById("BotonConfirmBaja").style.display = "inline";

    document.getElementById("FormularioABM").style.display = "block";
    document.getElementById("FormularioLista").style.display = "none";

    document.getElementById("BotonConfirmBaja").onclick = function() 
    {
        BorrarPersona(persona.id);
    };
}

function BorrarPersona(id) 
{
    MostrarSpinner();
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", apiUrl);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function () 
    {
        if(xhr.readyState == 4) 
        {
            if(xhr.status == 200) 
            {
                listadoPersonas = listadoPersonas.filter(v => v.id.toString() !== id.toString());
                CargarFilas();
                alert("Persona borrada correctamente. Volviendo al listado..");
            }
            else
            {
                alert("Hubo errores al realizar la baja. No se realizaron cambios...");
            }
        }
        OcultarSpinner();
        OcultarABM();   
    };
    xhr.send(JSON.stringify({ id: id }));
}

function HeaderForm(mode) 
{
    document.getElementById("HeaderABM").innerHTML = `${mode} de Persona`;
}

function OcultarABM() 
{
    document.getElementById("FormularioABM").style.display = "none";
    document.getElementById("FormularioLista").style.display = "block";
    document.getElementById("BotonAceptar").style.display = "inline";
    document.getElementById("BotonConfirmBaja").style.display = "none";
}

function RestablecerABM() 
{
    document.getElementById("IdABM").value = "";
    document.getElementById("NombreABM").value = "";
    document.getElementById("ApellidoABM").value = "";
    document.getElementById("FechaNacimientoABM").value = "";
    document.getElementById("DniABM").value = "";
    document.getElementById("PaisOrigenABM").value = "";
}



let listadoPersonas = [];

document.addEventListener("DOMContentLoaded", function () 
{
    ListadoPersonas();
    document.getElementById("BotonAgregar").addEventListener("click", () => 
    {
        MostrarFormAlta();
        HeaderForm("Alta");
    });

    document.getElementById("BotonCancelar").addEventListener("click", () => 
    {
        OcultarABM();
    });

    document.getElementById("BotonAceptar").addEventListener("click", () => 
    {
        ConfirmarAlta();
    });

    document.getElementById("TipoPersonaSelect").addEventListener("change", function() 
    {
        MostrarAtributosPorTipo(this.value);
    });
});