const path = require("path");

module.exports = {
    mode: "development",
    entry: "./src/index.js", // входная точка - исходный файл
    output:{
        path: path.resolve(__dirname, "./www"),     // путь к каталогу выходных файлов - папка public
        publicPath: "/www/",
        filename: "bundle.js"       // название создаваемого файла
    },
    devServer: {
        historyApiFallback: true,
        static: {
            directory: path.join(__dirname, "/www/"),
        },
        port: 8081,
        open: true
    },
    module:{
        rules:[   //загрузчик для jsx
            {
                test: /\.jsx?$/, // определяем тип файлов
                exclude: /(node_modules)/,  // исключаем из обработки папку node_modules
                loader: "babel-loader",   // определяем загрузчик
                options:{
                    presets:[ "@babel/preset-react"]    // используемые плагины
                }
            }
        ]
    }
}