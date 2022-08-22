import './styles/style.css';
import _ from 'lodash';
import printMe from "./scripts/print";
import {square} from './scripts/math.ts'
import {qrComponent} from './scripts/qrCode.ts'


function demoComponent() {

    var num = Math.floor(Math.random() * 10 + 1)

    var element = document.createElement('div');
    var div1 = document.createElement('div');
    var div2 = document.createElement('div');
    var btn = document.createElement('button');

    div1.classList.add('hello');
    div1.innerHTML = _.join(['Demo', 'Page', num, square(num)], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;

    element.appendChild(div1);
    element.appendChild(div2);
    div2.appendChild(btn);

    return element;
}

function canvasQR() {

    var element = document.createElement('div');
    var canvas = qrComponent("https://zlab.dev")

    element.classList.add('qrcode');
    element.appendChild(canvas);

    return element;
}

document.body.appendChild(demoComponent());
document.body.appendChild(canvasQR());
