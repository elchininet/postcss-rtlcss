export const cssLines = `.test1, .test2 {
    background: url("/folder/subfolder/icons/ltr/chevron-left.png");
    background-color: #FFF;
    background-position: 10px 20px;
    border-radius: 0 2px 0 8px;
    color: #666;
    padding-right: 20px;
    text-align: left;
    transform: translate(-50%, 50%);
    width: 100%;
}

.test3:hover,
.test4:active {
    font-family: Arial, Helvetica /*rtl:prepend:"Droid Arabic Kufi", */;
    font-size: 20px /*rtl:30px*/;
    color: '#FFF' /*rtl:#000*/;
    transform: translateY(10px) /*rtl:append:scaleX(-1)*/;
    padding: 10px /*rtl:insert:20px*/;
}

/*rtl:begin:ignore*/
#test5, #test6 {
    left: 10px;
    position: relative;
    text-align: right;
}

.test7 .test8 span {
    border-left-color: #777;
    margin: 10px 20px 30px 40px;
    transform: translate(100%, 10%);
}
/*rtl:end:ignore*/

.test9 {
    animation: 5s flip 1s ease-in-out,
               3s my-animation 6s ease-in-out;
    font-size: 10px;
    padding: 10px 20px 40px 10px;
}

@keyframes flip {
    from {
        transform: translateX(100px);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes my-animation {
    from {
        left: 0%;
    }
    to {
        left: 100%;
    }
}

.test10-ltr {
    color: #000;
    width: 100%;
}

.test11-left::before {
    content: "keyboard_arrow_left";
}

.test11-right::before {
    content: "keyboard_arrow_right";
}

.testleft12 {
    border: 1px solid gray;
}

.testleft13 {
    content: "keyboard_arrow_left";
}

.testright14 {
    content: "keyboard_arrow_right";
}`;