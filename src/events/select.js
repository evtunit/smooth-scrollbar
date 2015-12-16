/**
 * @module
 * @prototype {Function} __selectHandler
 */

 import '../apis/';
 import '../internals/';
 import { SmoothScrollbar } from '../smooth_scrollbar';
 import { getOriginalEvent, getPosition, getTouchID, pickInRange, setStyle } from '../utils/index';

 export { SmoothScrollbar };

// todo: select handler for touch screen
 let __selectHandler = function({ speed, stepLength }) {
    let isSelected = false;
    let animation = undefined;

    const { container } = this.targets;
    const bounding = container.getBoundingClientRect();

    let getDir = (evt) => {
        const { x, y } = getPosition(evt);

        return [
            x > bounding.right ? 1 : (x < bounding.left ? -1 : 0),
            y > bounding.bottom ? 1 : (y < bounding.top ? -1 : 0)
        ]
    };

    let scroll = ([x, y]) => {
        const { offset } = this;
        this.scrollTo(offset.x + x * speed * stepLength, offset.y + y * speed * stepLength, 100);
    };

    let setSelect = (value = 'auto') => {
        setStyle(container, {
            '-webkit-user-select': value,
               '-moz-user-select': value,
                '-ms-user-select': value,
                    'user-select': value
        });
    };

    this.addEvent(window, 'mousemove', (evt) => {
        if (this.__fromChild(evt)) {
            return setSelect('none');
        }

        if (!isSelected) return;

        clearInterval(animation);
        setSelect('auto');

        const dir = getDir(evt);

        if (!x && !y) return;

        scroll(dir);
        animation = setInterval(() => {
            scroll(dir);
        }, 1000);
    });

    this.addEvent(container, 'selectstart', (evt) => {
        evt.stopPropagation();
        isSelected = true;
    });

    this.addEvent(window, 'mouseup blur', () => {
        clearInterval(animation);
        setSelect('auto');

        isSelected = false;
    });
 };

 Object.defineProperty(SmoothScrollbar.prototype, '__selectHandler', {
     value: __selectHandler,
     writable: true,
     configurable: true
 });
