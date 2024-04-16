import { bar } from "./widgets/bar.js"

Utils.monitorFile(
    `${App.configDir}/sass`,

    function () {
        const scss = `${App.configDir}/sass/style.scss`
        const css = `/tmp/ags.css`

        Utils.exec(`sass ${scss} ${css}`)
        App.resetCss()
        App.applyCss(css)
    },
)

App.applyCss('/tmp/ags.css')

App.config({
    windows: [bar],
})
