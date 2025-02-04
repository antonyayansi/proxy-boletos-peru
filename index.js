var express = require('express')
var cors = require('cors')
var fetch = require('node-fetch') // Asegúrate de tenerlo instalado
var axios = require('axios')

// 🔥 Desactiva la verificación SSL en Node.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

var app = express()
app.use(cors())

app.get('/circuitos', async function (req, res) {
    try {
        const response = await fetch('https://api-tuboleto.cultura.pe/visita/lugar-info?idLugar=llaqta_machupicchu')

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`)
        }

        const data = await response.json()

        // Verificar si los encabezados ya se enviaron antes de enviar otra respuesta
        if (!res.headersSent) {
            res.json(data) // Enviar respuesta JSON solo una vez
        }
    } catch (error) {
        console.error("Error al obtener circuitos:", error)

        // Verificar si los encabezados ya se enviaron antes de enviar un error
        if (!res.headersSent) {
            res.status(500).json({ error: 'Error al obtener datos' })
        }
    }
})

app.get('/fechas', async function(req, res){
    try {
        const { nidruta } = req.query;
        const response = await fetch(`https://api-tuboleto.cultura.pe/visita/consulta-fechas-disponibles?nidruta=${nidruta}`)

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`)
        }

        const data = await response.json()

        res.json(data)
    } catch (error) {
        console.error("Error al obtener fechas:", error)

        // Verificar si los encabezados ya se enviaron antes de enviar un error
        if (!res.headersSent) {
            res.status(500).json({ error: 'Error al obtener datos' })
        }
    }
}) 

app.get('/cupos', async function (req, res) {
    try {
        const { df_inicio, nidcircuito, nidlugar, nidruta, token } = req.query;

        console.log({ df_inicio, nidcircuito, nidlugar, nidruta, token });

        const response = await axios.post(`https://api-tuboleto.cultura.pe/visita/consulta-horarios`, {
            df_inicio, nidcircuito, nidlugar, nidruta, token
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error en la solicitud:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: "Error en la solicitud" });
    }
        
    // try {

    //     const { df_inicio ,nidcircuito, nidlugar, nidruta, token } = req.query;


    //     const response = await fetch(`https://api-tuboleto.cultura.pe/visita/consulta-horarios?token=${token}`, {
    //         method: 'POST',
    //         body: {
    //             df_inicio,
    //             nidcircuito,
    //             nidlugar,
    //             nidruta,
    //             token
    //         }
    //     })

    //     if (!response.ok) {
    //         throw new Error(`Error HTTP: ${response.status}`)
    //     }

    //     const data = await response.json()

    //     res.json(data)
    // } catch (error) {
    //     console.error("Error al obtener fechas:", error)

    //     // Verificar si los encabezados ya se enviaron antes de enviar un error
    //     if (!res.headersSent) {
    //         res.status(500).json({ error: 'Error al obtener datos' })
    //     }
    // }
})

app.listen(3000, function () {
    console.log('🚀 Servidor corriendo en http://localhost:3000')
})
