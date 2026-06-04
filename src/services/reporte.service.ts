import { Types } from "mongoose";
import { Usuario } from "../models/usuario.model";
import { Prestamo } from "../models/prestamo.model";
import { PrestamoJuego } from "../models/prestamojuego.model";
import { Juego } from "../models/juego.model";
import { JuegoCategoria } from "../models/juegoCategoria.model";
import { Categoria } from "../models/categoria.model";
import { Compra } from "../models/compra.model";
import { yearToDate, monthToDate } from "../utils/date.helper";
import * as CompraTypes from "../types/compras.types";
import * as PrestamoTypes from "../types/prestamos.types";
import * as ServicioTypes from "../types/servicio.types";
import * as ReportesTypes from "../types/reporte.types";

export async function getTop5MostUsedGamesByUser(idUser: string) {
  try {
    const formatedIdUser = new Types.ObjectId(idUser);
    const foundUser = await Usuario.findById(formatedIdUser);
    if (!foundUser) {
      return {
        result: false,
        statusCode: 404,
        messageState: "Usuario no encontrado."
      };
    }

    const foundUserLoans = await Prestamo.find({
      id_usuario: formatedIdUser
    }, "_id");
    if (!foundUserLoans || foundUserLoans.length === 0) {
      return {
        result: true,
        statusCode: 200,
        messageState: "El usuario no tiene prestamos registrados."
      };
    }

    const foundLoanGames = [];
    for (const userLoan of foundUserLoans) {
      const foundLoanGame = await PrestamoJuego.findOne({
        id_prestamo: userLoan._id
      }, "id_juego");
      if (foundLoanGame) {
        foundLoanGames.push(foundLoanGame);
      }
    }

    const mostUsedGames = new Map();
    foundLoanGames.forEach(gameFreq => {
      const count = mostUsedGames.get(gameFreq.id_juego) || 0;
      mostUsedGames.set(gameFreq.id_juego, count + 1)
    });
    if (!mostUsedGames || mostUsedGames.size === 0) {
      return {
        result: true,
        statusCode: 200,
        messageState: "El usuario no tiene juegos prestados o alquiados."
      };
    }

    const games = [];
    for (let [idGame, count] of mostUsedGames.entries()) {
      const currentGame = await Juego.findOne({
        _id: idGame
      }, "titulo");
      if (currentGame) {
        const gameInfo = { titulo: currentGame.titulo, cantidad_prestamos: count };
        games.push(gameInfo);
      }
    }
    let orderedGames = games.sort((a, b) => b.cantidad_prestamos - a.cantidad_prestamos);
    if (orderedGames.length >= 5) {
      orderedGames = orderedGames.slice(0, 5);
    }
    return {
      result: true,
      statusCode: 200,
      messageState: "Informacion de juegos mas prestados/alquilados obtenida correctamente.",
      data: orderedGames
    }
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}

export async function getGamesByStock(
  allGames: boolean,
  order: string,
  amount?: number) {
  try {
    const sortCondition = (order === ReportesTypes.Ordenamiento.ASCENDENTE)
      ? { cantidad: 1 as const }
      : { cantidad: -1 as const };

    const foundGames = await Juego.find({
    }, "_id titulo descripcion cantidad cantidad_prestamo disponible activo")
      .sort(sortCondition);
    if (!foundGames || foundGames.length === 0) {
      return {
        result: true,
        statusCode: 200,
        messageState: "No hay juegos registrados."
      };
    }

    let formatedGames;
    if (allGames && amount) {
      if (amount < 0 || amount > foundGames.length) {
        return {
          result: false,
          statusCode: 400,
          messageState: "Cantidad invalida."
        };
      }
      formatedGames = foundGames.slice(0, amount);
    } else {
      formatedGames = foundGames;
    }
    const message = (amount)
      ? `Los primeros ${amount} juegos obtenido correctamente por stock.`
      : `Juegos obtenidos correctamente por stock.`
    return {
      result: true,
      statusCode: 200,
      messageState: message,
      data: formatedGames
    };
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}

export async function getCategiryPopularity() {
  try {
    const foundLoanGames = await PrestamoJuego.find({}, "id_juego");
    if (!foundLoanGames || foundLoanGames.length === 0) {
      return {
        result: true,
        statusCode: 200,
        messageState: "No hay prestamos registrados."
      };
    }

    const uniqueGames = [...new Set(foundLoanGames.map(loanGame => loanGame.id_juego.toString()))];

    const foundCategories = await JuegoCategoria.find({
      id_juego: { $in: uniqueGames }
    }, "id_categoria");

    const categoryFrequency = new Map();
    foundCategories.forEach(catFreq => {
      const idCategory = catFreq.id_categoria.toString();
      const count = categoryFrequency.get(idCategory) || 0;
      categoryFrequency.set(idCategory, count + 1)
    });
    const categoryLength = categoryFrequency.size;
    if (!categoryFrequency || categoryLength === 0) {
      return {
        result: true,
        statusCode: 200,
        messageState: "No hay categorias publicadas o juegos registrados."
      };
    }

    const totalUniqueGames = uniqueGames.length;
    const categories = [];
    for (let [idCategory, count] of categoryFrequency.entries()) {
      const currentCategory = await Categoria.findOne({
        _id: idCategory
      }, "descripcion");
      if (currentCategory) {
        const categoryInfo = { descripcion: currentCategory.descripcion, frecuencia: (count / totalUniqueGames) * 100 };
        categories.push(categoryInfo);
      }
    }
    let orderedCategories = categories.sort((a, b) => b.frecuencia - a.frecuencia);
    return {
      result: true,
      statusCode: 200,
      messageState: "Informacion de categorias obtenida correctamente.",
      data: orderedCategories
    }
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}

export async function handlePerPeriod(
  timePeriod: string,
  timeValue: string,
  action: "sells" | "borrows") {
  try {
    let foundGames;
    let magicWord;
    let startDate;
    let endDate;
    if (timePeriod === ReportesTypes.PeriodoTiempo.ANIO) {
      startDate = yearToDate(timeValue);
      if (isNaN(startDate.getTime())) {
        return {
          result: false,
          statusCode: 400,
          messageState: "Fecha invalida."
        };
      }
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      endDate.setDate(endDate.getDate() - 1);
      magicWord = "anuales";
    } else if (timePeriod === ReportesTypes.PeriodoTiempo.MES) {
      startDate = monthToDate(timeValue);
      if (isNaN(startDate.getTime())) {
        return {
          result: false,
          statusCode: 400,
          messageState: "Fecha invalida."
        };
      }
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(endDate.getDate() - 1);
      magicWord = "mensuales";
    } else {
      startDate = new Date(timeValue);
      if (isNaN(startDate.getTime())) {
        return {
          result: false,
          statusCode: 400,
          messageState: "Fecha invalida."
        };
      }
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      endDate.setMilliseconds(-1);
      magicWord = "diarios";
    }


    let foundServices;
    if (action === "sells") {
      foundServices = await Compra.find({
        createdAt: { $gte: startDate, $lte: endDate }
      }, "total").select("-comprobante");
    } else {
      foundServices = await PrestamoJuego.find({
        createdAt: { $gte: startDate, $lte: endDate },
      }, "servicio");
    }

    if (!foundServices || foundServices.length === 0) {
      return {
        result: true,
        statusCode: 200,
        messageState: "No hay ingresos registrados."
      };
    }

    let serviceInfo;
    if (action === "sells") {
      let totalIncome = 0;
      (foundServices as CompraTypes.ICompra[]).forEach(purchase => {
        totalIncome = totalIncome + purchase.total
      });
      serviceInfo = { ganancia: totalIncome };
    } else {
      const totalBorrows = foundServices.length;
      let countLoans = 0;
      let countRents = 0;
      (foundServices as PrestamoTypes.IPrestamoJuego[]).forEach(borrow => {
        if (borrow.servicio === ServicioTypes.TipoServicio.PRESTAMO) {
          countLoans = countLoans + 1;
        }
        if (borrow.servicio === ServicioTypes.TipoServicio.ALQUILER) {
          countRents = countRents + 1;
        }
      });
      serviceInfo = { prestamos_totales: totalBorrows, prestamos: countLoans, alquileres: countRents };
    }
    return {
      result: true,
      statusCode: 200,
      messageState: `Ingresos ${magicWord} obtenidos correctamente.`,
      data: serviceInfo
    }
  } catch (err) {
    return {
      result: false,
      statusCode: 500,
      messageState: `Error interno en el servidor: ${(err as Error).message}`
    };
  }
}

export async function getIncomePerPeriod(timePeriod: string, timeValue: string) {
  return await handlePerPeriod(timePeriod, timeValue, "sells");
}

export async function getBorrowsPerPeriod(timePeriod: string, timeValue: string) {
  return await handlePerPeriod(timePeriod, timeValue, "borrows");
}