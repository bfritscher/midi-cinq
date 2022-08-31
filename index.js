import { getMenuItems } from "./parser.js";
import path from "path";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyProxy from "@fastify/http-proxy";
import * as url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const server = Fastify({
  logger: true,
});
server.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
  prefix: "/",
});
server.register(fastifyProxy, {
  upstream: "https://mylpj.ch/devabr/cinqsens-automate-standalone/css/",
  prefix: "/css", // optional
});
server.register(fastifyProxy, {
  upstream: "https://mylpj.ch/devabr/cinqsens-automate-standalone/img/",
  prefix: "/img", // optional
});

function mainLayout(content, css='', script='') {
  return `<html>
  <head>
    <meta charset="UTF-8">
    <title>Midi Cinq - Automate</title>
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="css/normalize.css?v=147">
    <link rel="stylesheet" href="css/styles.css?v=147">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <style>
    #menus h2 {
      padding: 20px 10px;
      margin: 20px 0;
      background-color: #8c8c8cb8;
    }
    .menu-item {
      width: 100%;
      max-width: 400px;
      min-width: 220px;
    }
    #menus #list-menu {
      justify-content: center;
    }
    main {
      background-image: url(fond.webp);
      background-repeat: repeat;
      background-size: auto !important;
      background-position: top left !important;
    }
    .nav-list {
      display: flex !important;
    }
    ${css}
    </style>
    <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
  </head>
  <body>
  <nav class="navbar">
    <div class="navbrand">
        <h1><a href="/" class="brand"><img src="./img/midicinq_logo.png"></a></h1>

        <div class="burger" id="burger">
			<span class="burger-open">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="16">
					<g fill="#FFF" fill-rule="evenodd">
						<path d="M0 0h24v2H0zM0 7h24v2H0zM0 14h24v2H0z"></path>
					</g>
				</svg>
			</span>
            <span class="burger-close">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
					<path fill="#FFF" fill-rule="evenodd" d="M17.778.808l1.414 1.414L11.414 10l7.778 7.778-1.414 1.414L10 11.414l-7.778 7.778-1.414-1.414L8.586 10 .808 2.222 2.222.808 10 8.586 17.778.808z"></path>
				</svg>
			</span>
        </div>
    </div>

    <ul class="nav-list" id="menu">
        <li class="menu-item"><a class="menu-link" href="/">Catégories</a></li>
        <li class="menu-item"><a class="menu-link" href="/automates">Automates</a></li>
    </ul>


</nav>
  <main><div id="menus">
${content}
  </div></main></body>
  <script>
  // HIDE MODAL CLICK OUTSIDE DIV
  $('body').click(function (event) {
      if(!$(event.target).closest('.light-modal-content').length && !$(event.target).is('.light-modal-content')) {
          $(".light-modal").hide();
      }
  });
  $(document).on('click', '.modal-menu', function(){
    const id = this.getAttribute('data-id');
    document.querySelector(\`#light-modal-\${id}\`).style.display = 'block';
  });
  $(document).on('click', '.close-modal', function(){
    const id = this.getAttribute('data-id');
    document.querySelector(\`#light-modal-\${id}\`).style.display = 'none';
  });
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/serviceworker.js");
  }
  ${script}
  </script>
  </html>`;
}

server.get("/", async (request, reply) => {
  reply.type("text/html");
  return mainLayout(`
  ${await getMenuItems(4)}
  ${await getMenuItems(7)}
  ${await getMenuItems(6)}
  ${await getMenuItems(9)}
  ${await getMenuItems(1)}
  ${await getMenuItems(3)}
  ${await getMenuItems(2)}
`);
});

server.get("/automates", async (request, reply) => {
  reply.type("text/html");
  return mainLayout(
  await getMenuItems('all'),
  `
    .machine-row {
      display: flex;
      overflow-x: auto;
      width: 100vw;
    }
    #menus #list-menu {
      flex-direction: column;
      flex-wrap: nowrap;
    }
  `,
  `
  function layout() {
    const index = {};
    const rows = [];
    [...document.querySelectorAll('#menus .menu-item')].forEach((item) => {
        [...item.querySelectorAll('.machine-numbers p')].forEach(p => {
            const num = parseInt(p.innerText, 10);
            const clone = item.cloneNode(true);
            const node = clone.querySelector('.machine-numbers')
            node.innerHTML = "";
            node.append(p);
            index[num] = clone;
            const rowNum = parseInt(p.innerText.slice(0, -1), 10) || 0;
            if (!(rowNum in rows)) {
                rows[rowNum] = [];
            }
            rows[rowNum].push(num);
            rows[rowNum].sort();
        })
        item.remove();
    });
    rows.forEach((row, i) => {
        const div = document.createElement('div');
        div.classList.add('machine-row');
        row.forEach(n => {
            div.append(index[n]);
        })
        if (i === 10) {
            const h2 = document.createElement('h2');
            h2.innerText = "Automate 2";
            document.getElementById('list-menu').append(h2);
        }
        document.getElementById('list-menu').append(div)
    })
}
layout();
  `
);
});

const port = process.env.PORT || 8080;

const start = async () => {
  try {
    await server.listen({ port, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
