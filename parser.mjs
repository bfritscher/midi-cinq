import fetch from "node-fetch";
import { JSDOM } from 'jsdom';

  const url =
    "https://mylpj.ch/devabr/cinqsens-automate-standalone/ctrl/list-menu.php";

export function getMenuItems(category) {
    const params = new URLSearchParams();
    params.append("Type", category); // 'all', or number
    params.append("Id", 16);
    params.append("Automate", 246532659);
    return fetch(url, {
      method: "post",
      body: params
    })
      .then((res) => res.text())
      .then((data) => {
        return eval(data);
        //.replace(/img\//g, 'https://mylpj.ch/devabr/cinqsens-automate-standalone/img/');
      }).catch((e) => {
        console.log(e)
        return "";
      })
    }