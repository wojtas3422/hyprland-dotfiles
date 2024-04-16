const mpris = await Service.import('mpris')
const hyprland = await Service.import('hyprland')
const systemtray = await Service.import('systemtray')
const audio = await Service.import('audio')

// Workspace numbers
const focusedTitle = Widget.Label({
    maxWidthChars: 70,
    truncate: 'end',
    label: hyprland.active.client.bind('title'),
    visible: hyprland.active.client.bind('address')
        .as(addr => !!addr),
})

const activeId = hyprland.active.workspace.bind("id")

const Workspaces = Widget.EventBox({
    name: 'bar-workspaces-container',
    child: Widget.Box({
        children: Array.from({ length: 10 }, (_, i) => i + 1).map(i => Widget.Button({
            attribute: i,
            label: `${i}`,
            class_name: activeId.as(activeId => `${i === activeId ? "bar-workspaces-button bar-workspaces-focused" : "bar-workspaces-button bar-workspaces-not-focused"}`),
            onClicked: () => hyprland.messageAsync(`dispatch workspace ${i}`),
        })),

        // remove this setup hook if you want fixed number of buttons
        setup: self => self.hook(hyprland, () => self.children.forEach(btn => {
            btn.visible = hyprland.workspaces.some(ws => ws.id === btn.attribute);
        })),
    }),
})

// Mpris
const Player = player => Widget.Button({
    onClicked: () => player.playPause(),
    child: Widget.Label({
        class_name: 'bar-mpris',
        maxWidthChars: 24,
        truncate: 'end',
    }).hook(player, label => {
        const { track_title } = player;
        label.label = label.label = `󰝚  ${track_title}`;
    }),
})

const players = Widget.Box({
    children: mpris.bind('players').as(p => p.map(Player))
})

// systray
const SysTrayItem = item => Widget.Button({
    class_name: 'bar-tray-icon',
    child: Widget.Icon().bind('icon', item, 'icon'),
    tooltipMarkup: item.bind('tooltip_markup'),
    onPrimaryClick: (_, event) => item.activate(event),
    onSecondaryClick: (_, event) => item.openMenu(event),
});

const sysTray = Widget.Box({
    children: systemtray.bind('items').as(i => i.map(SysTrayItem))
})


// audio
const volumeIndicator = Widget.EventBox({
    onPrimaryClick: () => audio.speaker.is_muted = !audio.speaker.is_muted,
    onScrollDown: () => audio['speaker'].volume = audio['speaker'].volume - 0.01,
    onScrollUp: () => audio['speaker'].volume = audio['speaker'].volume + 0.01,

    child: Widget.Label({ class_name: 'bar-audio' }).hook(audio.speaker, self => {
        const vol = audio.speaker.volume * 100;
        const icon = [
            [101, 'overamplified'],
            [67, 'high'],
            [34, 'medium'],
            [1, 'low'],
            [0, 'muted'],
        ].find(([threshold]) => threshold <= vol)?.[1];

        self.icon = `audio-volume-${icon}-symbolic`;
        self.label = `  ${Math.floor(vol)}%`;
    }),
})

// time
const date = Variable('', {
    poll: [1000, () => {
        const date = new Date()
        const hour = date.getHours().toString().padStart(2 , '0')
        const minute = date.getMinutes().toString().padStart(2, '0')
        
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth()+1).toString().padStart(2, '0')
        const year = date.getFullYear()

        return `  ${hour}:${minute}   󰭦 ${day}-${month}-${year}`  
    }]
})
const dateLabel = Widget.Label({ label: date.bind() })

const barContainer = Widget.CenterBox({
    class_name: 'bar-container',
    startWidget: Widget.Box({
        children: [
            Workspaces,
            players
        ]
    }),
    centerWidget: Widget.Box({
        children: [
            focusedTitle,
        ]
    }),
    endWidget: Widget.Box({
        hpack: 'end',
        spacing: 4,
        children: [
            volumeIndicator,
            dateLabel,
            sysTray
        ]
    }),
    spacing: 8
})

export const bar = Widget.Window({
    child: barContainer,
    exclusivity: 'exclusive',
    class_name: 'bar-window',
    name: 'ags-bar',
    anchor: ['top', 'right', 'left']
})
