import {DanmakuType} from '../enum';
// Dialogue: 0,0:00:00.00,0:00:08.00,R2L,,20,20,2,,{\move(622.5,25,-62.5,25)}标准小裤裤
// Dialogue: 0,0:00:08.35,0:00:12.35,Fix,,20,20,2,,{\pos(280,50)\c&HEAA000}没男主吗

let formatTime = seconds => {
    let div = (i, j) => Math.floor(i / j);
    let pad = n => (n < 10 ? '0' + n : '' + n);

    let integer = Math.floor(seconds);
    let hour = div(integer, 60 * 60);
    let minute = div(integer, 60) % 60;
    let second = integer % 60;
    let minorSecond = Math.floor((seconds - integer) * 100); // 取小数部分2位

    return `${hour}:${pad(minute)}:${pad(second)}.${minorSecond}`;
};

let encode = text => text.replace(/\{/g, '｛').replace(/\}/g, '｝').replace(/\r|\n/g, '');

let scrollCommand = ({start, end, top}) => String.raw`\move(${start},${top},${end},${top})`;
let fixCommand = ({top, left}) => String.raw`\pos(${left},${top})\an8`;
// TODO: 添加颜色的指令

export default (danmaku, config) => {
    let {fontSizeType, content, time} = danmaku;
    let {scrollTime, fixTime} = config;

    let prefix = '{' + (danmaku.type === DanmakuType.SCROLL ? scrollCommand(danmaku) : fixCommand(danmaku)) + '}';

    let fields = [
        0, // Layer,
        formatTime(time), // Start
        formatTime(time + (danmaku.type === DanmakuType.SCROLL ? scrollTime : fixTime)), // End
        'F' + fontSizeType, // Style
        '', // Name
        '0000', // MarginL
        '0000', // MarginR
        '0000', // MarginV
        '', // Effect
        prefix + encode(content) // Text
    ];

    return 'Dialogue: ' + fields.join(',');
};
