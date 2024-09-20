import pool from "../models/connection";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import {
  UserRequestBody,
  CheckLoggedInResponse,
  GetMenuAccessQuery,
  HierarchicalMenuAccess,
} from "../types/types";

// Checks for a specific cookie
export const checkLoggedIn = async (
  req: Request,
  res: Response<CheckLoggedInResponse | { message: string }>
): Promise<void> => {
  if (req.signedCookies.userId) {
    // Fetch user info based on userId
    try {
      const result = await pool.query(
        "SELECT username FROM users WHERE iduser = $1",
        [req.signedCookies.userId]
      );
      const user = result.rows[0];
      res.status(200).json({
        loggedIn: true,
        userId: req.signedCookies.userId,
        username: user ? user.username : "",
      });
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      res.status(500).send({ message: error.message });
    }
  } else {
    res.status(401).json({ loggedIn: false });
  }
};

export const login = async (
  req: Request<{}, {}, { username: string; password: string }>,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;
  console.log("Request body:", req.body);

  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE username = $1 AND status_user = 1`,
      [username]
    );

    if (result.rows.length > 0) {
      // Extract user data
      const user = result.rows[0];
      const hashedPassword = user.pass_user;
      const isMatch = await bcrypt.compare(password, hashedPassword);

      if (isMatch) {
        const userId = user.iduser;

        res.cookie("userId", userId, {
          httpOnly: true,
          maxAge: 60000 * 60, // expires in 1 hour
          signed: true,
          sameSite: "strict",
        });

        res.status(200).json({
          userId,
          loggedIn: true,
        });
      } else {
        // Password incorrect
        res.status(401).json({
          message: "Password incorrect!",
        });
      }
    } else {
      // User does not exist
      res.status(404).json({
        message: "User does not exist",
      });
    }
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

// get menus with access
export const getMenuAccess = async (
  req: Request<{}, {}, {}, GetMenuAccessQuery>,
  res: Response<HierarchicalMenuAccess[] | { message: string }>
): Promise<void> => {
  try {
    /*
      3 types of response
      
      when userId is null returns all existing menus
      when userId is not null and responseType = 'all' returns all existing menus access or not
      when userId is not null and responseType = 'allowed' returns just the menus with access
      */
    let { userId, responseType } = req.query;

    let ex = "";
    if (!userId) {
      userId = 0;
    } else {
      if (responseType == "allowed") {
        ex = `and access_mmu2 = 1`;
      }
    }

    const result = await pool.query(`select 
          idmm2, idmm, name_mm, link_mm, order_mm, fa_mm, type_mm,
          idmm_mm2, name_mm2, link_mm2, order_mm2,
          coalesce(access_mmu2, 0) as access_menu

          from navbar_menu2
          left join navbar_menu on navbar_menu2.idmm_mm2 = navbar_menu.idmm 
          left join (select idmm_mmu2, access_mmu2 from navbar_menu_user where iduser_mmu2 = ${userId} ) UA on navbar_menu2.idmm2 = UA.idmm_mmu2

          where navbar_menu2.status_mm2 = 1  ${ex}
          group by idmm2, idmm, access_menu
          order by order_mm, order_mm2
      `);

    const datarows: HierarchicalMenuAccess[] = [];
    const menuMap: Record<number | string, HierarchicalMenuAccess> = {};

    result.rows.forEach((row) => {
      if (!menuMap[row.idmm]) {
        menuMap[row.idmm] = {
          idmm: row.idmm,
          name_mm: row.name_mm,
          link_mm: row.link_mm,
          order_mm: row.order_mm,
          fa_mm: row.fa_mm,
          type_mm: row.type_mm,
          subMenus: [],
        };
        datarows.push(menuMap[row.idmm]);
      }
      menuMap[row.idmm].subMenus.push({
        idmm2: row.idmm2,
        idmm_mm2: row.idmm_mm2,
        name_mm2: row.name_mm2,
        link_mm2: row.link_mm2,
        order_mm2: row.order_mm2,
        access_menu: row.access_menu,
      });
    });

    console.log(datarows[0].subMenus);
    res.status(200).json(datarows);
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

//logout
export const logout = (req: Request, res: Response): void => {
  res.clearCookie("userId");
  res.json({
    userId: "",
    loggedIn: false,
  });
};

// Add user
export const addUser = async (
  req: Request<{}, {}, UserRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { name_user, username, pass_user, mail_user } = req.body;

    const result = await pool.query(`select from users where username = $1`, [
      username,
    ]);
    if (result.rows.length > 0) {
      res.status(401).send("User already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(pass_user, 12);

    await pool.query(
      `INSERT INTO users (name_user, username, mail_user, pass_user) VALUES ($1, $2, $3, $4)`,
      [name_user, username, mail_user, hashedPassword]
    );

    res.status(201).send("User created!");
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

// Get user
export const getUserList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await pool.query(
      `select * from users where status_user = 1`
    );

    res.status(200).json(result.rows);
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

export const deleteUser = async (
  req: Request<{ iduser: string }>,
  res: Response
): Promise<void> => {
  try {
    const { iduser } = req.params;

    await pool.query(`UPDATE users SET status_user = 0 WHERE iduser = $1`, [
      iduser,
    ]);

    res.status(201).send("User deleted!");
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

// Update user
export const updateUser = async (
  req: Request<{ iduser: string }, {}, UserRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { iduser } = req.params;
    let { name_user, username, pass_user, mail_user } = req.body;

    const hashedPassword = await bcrypt.hash(pass_user, 12);

    await pool.query(
      `UPDATE users set name_user = $1, username = $2, pass_user = $3, mail_user = $4 where iduser = $5`,
      [name_user, username, hashedPassword, mail_user, iduser]
    );

    res.status(201).send("User updated!");
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

// Update Menu Access
export const updateMenuAccess = async (
  req: Request<{ iduser: string }, {}, { idmm2: number; access: number }>,
  res: Response
): Promise<void> => {
  try {
    const { iduser } = req.params;
    const { idmm2, access } = req.body;
    const val = await pool.query(
      "SELECT idmm_mmu2 FROM navbar_menu_user WHERE idmm_mmu2 = $1 AND iduser_mmu2 = $2",
      [idmm2, iduser]
    );
    if (val.rows.length > 0) {
      await pool.query(
        "UPDATE navbar_menu_user SET access_mmu2 = $1 WHERE idmm_mmu2 = $2 AND iduser_mmu2 = $3",
        [access, idmm2, iduser]
      );
    } else {
      await pool.query(
        "INSERT INTO navbar_menu_user (iduser_mmu2, idmm_mmu2, access_mmu2) VALUES ($1, $2, $3)",
        [iduser, idmm2, access]
      );
    }
    res.status(201).send("User Access updated!");
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).send(error.message);
  }
};
