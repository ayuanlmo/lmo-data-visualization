import {useDebounce} from "./utils.js";

export default class TempLate {
    constructor(conf) {
        this.conf = conf;
        this.initDrag();
        this.initDefaultTextStyle();
    }


    fetchData() {
        fetch('data.json').then(res => {
            return res.json();
        }).then(json => {

        });
    }

    sendTemplateSelectTextConfig(el) {
        this.sendMessage('TEMPLATE_SELECT_TEXT_ELEMENT', {
            ...this.conf.config.text[`${el.getAttribute('data-name')}`]
        });
    }

    sendMessage(type = '', message = '') {
        parent.postMessage({
            type,
            message
        }, location.origin);
    }

    initDrag() {
        const elements = ['main-title', 'sub-title', 'from-source'];
        const mainTitle = document.getElementById('main-title');
        const subTitle = document.getElementById('sub-title');
        const formSource = document.getElementById('from-source');

        mainTitle.setAttribute('data-name', 'mainTitle');
        subTitle.setAttribute('data-name', 'sub-title');
        formSource.setAttribute('data-name', 'from-source');

        const initInteract = (element) => {
            initSquare(element);

            const __this = this;

            const moveDebounce = useDebounce(function (x, y, el) {
                const elData = el.getAttribute('data-name');

                __this.conf.config.text[elData].x = x;
                __this.conf.config.text[elData].y = y;

                __this.sendTemplateSelectTextConfig(el);
            }, 100)

            let x = 0, y = 0, angle = 0, scale = 1;
            interact(element)
                .draggable({
                    inertia: false,
                    modifiers: [
                        interact.modifiers.restrictRect({
                            restriction: 'parent',
                            endOnly: true
                        })
                    ],
                    onstart: function (event) {
                        x = event.clientX;
                        y = event.clientY;
                    },
                    onmove: function (event) {
                        const dx = event.clientX - x;
                        const dy = event.clientY - y;
                        const newX = parseInt(element.style.left) + dx;
                        const newY = parseInt(element.style.top) + dy;
                        element.style.left = newX + 'px';
                        element.style.top = newY + 'px';
                        x = event.clientX;
                        y = event.clientY;
                        moveDebounce(newY, newX, element);
                    }
                })
                .resizable({
                    edges: {left: true, right: true, bottom: true, top: true},

                    listeners: {
                        move(event) {
                            const target = event.target;
                            let x = (parseFloat(target.getAttribute('data-x')) || 0);
                            let y = (parseFloat(target.getAttribute('data-y')) || 0);

                            target.style.width = event.rect.width + 'px'
                            target.style.height = event.rect.height + 'px'
                            x += event.deltaRect.left
                            y += event.deltaRect.top

                            target.style.transform = 'translate(' + x + 'px,' + y + 'px)'
                            target.setAttribute('data-x', x)
                            target.setAttribute('data-y', y)
                        }
                    },
                    modifiers: [
                        interact.modifiers.restrictEdges({
                            outer: 'parent'
                        }),
                        interact.modifiers.restrictSize({
                            min: {width: 10, height: 10}
                        })
                    ],

                    inertia: true
                })
        }
        const initEvent = (element) => {
            element.addEventListener('mousedown', (e) => {
                e.stopPropagation()
                element.classList.add('square-container');
                element.classList.add('active');

                elements.forEach(i => {
                    if (e.target.classList.contains('text-value')) {
                        const idName = e.target.parentElement.id;
                        if (i !== idName) {
                            const _ = document.getElementById(i)

                            _.classList.remove('active');
                            _.classList.remove('square-container');
                        }
                    }
                })
            });
            element.addEventListener('click', (e) => {
                let el = e.target;

                // 子元素点击时，切换到父元素
                if (el.classList.contains('text-value'))
                    el = el.parentElement;
                this.sendTemplateSelectTextConfig(el);

                elements.forEach(i => {
                    if (e.target.classList.contains('text-value')) {
                        const idName = e.target.parentElement.id;
                        if (i !== idName) {
                            const _ = document.getElementById(i)

                            _.classList.remove('active');
                            _.classList.remove('square-container');
                        }
                    } else {
                        const idName = e.target.id;
                        if (i !== idName) {
                            const _ = document.getElementById(i)

                            _.classList.remove('active');
                            _.classList.remove('square-container');
                        }
                    }

                })
            });
            initGlobalEvent();
        }

        initInteract(mainTitle);
        initInteract(subTitle);
        initInteract(formSource);
        initEvent(mainTitle);
        initEvent(subTitle);
        initEvent(formSource);

        function initSquare(element) {
            const squareTL = document.createElement('div');
            const squareTR = document.createElement('div');
            const squareBL = document.createElement('div');
            const squareBR = document.createElement('div');

            squareTL.classList.add('square');
            squareTL.classList.add('top-left');
            squareTR.classList.add('square');
            squareTR.classList.add('top-right');
            squareBL.classList.add('square');
            squareBL.classList.add('bottom-left');
            squareBR.classList.add('square');
            squareBR.classList.add('bottom-right');

            element.append(squareTL);
            element.append(squareTR);
            element.append(squareBL);
            element.append(squareBR);

            initSquareEvent();
        }

        function initSquareEvent() {
            // 给所有square 阻止冒泡
            document.querySelectorAll('.square').forEach(i => {
                i.addEventListener('click', (e) => {
                    e.stopPropagation();
                })
            });
        }


        function initGlobalEvent() {
            document.addEventListener('click', (e) => {
                    elements.forEach(i => {
                        const idName = e.target.parentElement.id;

                        if (i !== idName && elements.includes(idName) || idName === '') {
                            document.getElementById(i).classList.remove('active');
                            document.getElementById(i).classList.remove('square-container');
                        }
                    });
                }
            )
        }
    }

    initDefaultTextStyle() {
        const template = document.getElementById('template');
        const mainTitle = document.getElementById('main-title');
        const subTitle = document.getElementById('sub-title');
        const fromSource = document.getElementById('from-source');

        template.style = 'width: 1920px;height: 1080px;';
        mainTitle.style = 'left: 160px; top: 1.2rem;';
        subTitle.style = 'left: 368px;top: 35px;';
        fromSource.style = 'left: 160px; top: 85px;';
    }
}
