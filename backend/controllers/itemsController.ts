import pool from "../models/connection.js";
import { Request, Response } from "express";
import { ItemBody, ItemParams } from "../types/types.js";

// GET ITEMS
export const itemList = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const result = await pool.query(
      `
            SELECT * FROM items WHERE status_item = $1`,
      [1]
    );
    return res.status(200).json(result.rows);
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    return res.status(500).send(error.message);
  }
};

//ADD ITEM
export const itemNew = async (
  req: Request<{}, {}, ItemBody>,
  res: Response
): Promise<Response> => {
  try {
    let {
      code_item,
      name_item,
      description_item,
      type_item,
      idunit_item,
      batch_ctrl_item,
      expiration_ctrl_item,
      imgurl_item,
    } = req.body as ItemBody;

    const result = await pool.query(
      "SELECT code_item FROM items where code_item = $1",
      [code_item]
    );
    if (result.rows.length > 0 || code_item.trim().length == 0) {
      return res.status(400).json({ error: "Item code already in use." });
    }

    await pool.query(
      "INSERT INTO items(code_item, name_item, description_item, type_item, idunit_item, batch_ctrl_item, expiration_ctrl_item, imgurl_item) values($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        code_item,
        name_item,
        description_item,
        type_item,
        idunit_item,
        batch_ctrl_item,
        expiration_ctrl_item,
        imgurl_item,
      ]
    );

    return res.status(201).send("Item created!");
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    return res.status(500).send(error.message);
  }
};

// UPDATE ITEM
export const itemUpdate = async (
  req: Request<{}, {}, ItemBody>,
  res: Response
): Promise<Response> => {
  try {
    let {
      code_item,
      name_item,
      description_item,
      type_item,
      idunit_item,
      batch_ctrl_item,
      expiration_ctrl_item,
      imgurl_item,
    } = req.body;

    await pool.query(
      "update items set code_item = $1, name_item = $2, description_item = $3, type_item = $4, idunit_item = $5, batch_ctrl_item = $6, expiration_ctrl_item = $7",
      [
        code_item,
        name_item,
        description_item,
        type_item,
        idunit_item,
        batch_ctrl_item,
        expiration_ctrl_item,
        imgurl_item,
      ]
    );

    return res.status(201).send("Item updated!");
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    return res.status(500).send(error.message);
  }
};

// DELETE ITEM
export const itemCancel = async (
  req: Request<ItemParams>,
  res: Response
): Promise<Response> => {
  try {
    const { iditem } = req.params;

    await pool.query("UPDATE items SET status_item = 0 WHERE iditem = $1", [
      iditem,
    ]);

    return res.status(201).send("Item canceled!");
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    return res.status(500).send(error.message);
  }
};
