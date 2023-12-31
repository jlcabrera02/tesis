import crearTesis from '@services/admin/tesis/crearTesis';
import editarTesis from '@services/admin/tesis/editarTesis';
import eliminarTesis from '@services/admin/tesis/eliminarTesis';
import editarTesisPDF from '@services/admin/tesis/updateTesisPDF';
import obtenerTesis, { obtenerTesisPorId } from '@services/public/obtenerTesis';
import path from 'path';
import fs from 'fs';

export const listTesis = async (req, res) => {
  try {
    const tesis = await obtenerTesis({ querys: req.query });
    res.status(200).json({ ok: true, response: tesis });
  } catch (err) {
    res.status(400).json({ ok: false, msg: 'Error al obtener información' });
  }
};

export const getTesis = async (req, res) => {
  try {
    const tesis = await obtenerTesisPorId({ params: req.params });
    res.status(200).json({ ok: true, response: tesis });
  } catch (err) {
    res.status(400).json({ ok: false, msg: 'Error al obtener información' });
  }
};

export const getTesisFile = async (req, res) => {
  const archivo = req.params.archivo;
  const rutaArchivo = path.join('/data/', archivo);

  // Utiliza fs para leer la imagen del volumen y enviarla como respuesta
  fs.readFile(rutaArchivo, (err, data) => {
    if (err) {
      res.status(404).send('Archivo no encontrado');
    } else {
      res.contentType('application/pdf charset=utf-8');
      res.send(data);
    }
  });
};

export const registerTesis = async (req, res) => {
  try {
    const tesis = req.files.tesis;
    const urlSave = `api/tesis/tesispdf/${tesis.md5}.pdf`;
    tesis.mv(`/data/${tesis.md5}.pdf`, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ ok: false, code: 400, msg: 'No se pudo almacenar la tesis' });
      }

      const bodyFile = { ...JSON.parse(req.body.data), tesis: urlSave };
      const create = await crearTesis(bodyFile);
      res.status(200).json({ ok: true, response: create });
    });
  } catch (err) {
    res.status(400).json({ ok: false, msg: 'Error al crear la tesis', err });
  }
};

export const updateTesisPDF = async (req, res) => {
  try {
    const tesis = req.files.tesis;
    const urlSave = `api/tesis/tesispdf/${tesis.md5}.pdf`;
    tesis.mv(`/data/${tesis.md5}.pdf`, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ ok: false, code: 400, msg: 'No se pudo almacenar la tesis' });
      }

      const bodyFile = { body: { tesis: urlSave }, params: req.params };
      const update = await editarTesisPDF(bodyFile);
      res.status(200).json({ ok: true, response: update });
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({ ok: false, msg: 'Error al actualizar el pdf', err });
  }
};

export const updateTesis = async (req, res) => {
  try {
    const editar = await editarTesis({
      body: req.body,
      params: req.params
    });

    res.status(200).json({ ok: true, response: editar });
  } catch (err) {
    res.status(400).json({ ok: false, msg: 'Error al editar la tesis', err });
  }
};

export const deleteTesis = async (req, res) => {
  try {
    const eliminar = await eliminarTesis({ params: req.params });
    res.status(200).json({ ok: true, response: eliminar });
  } catch (err) {
    res.status(400).json({ ok: false, msg: 'Error al eliminar la tesis', err });
  }
};
