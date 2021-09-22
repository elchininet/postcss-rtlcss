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

/*rtl:rename*/
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
}

.test15 {
    color: #EFEFEF;
    left: 10px;
    /*rtl:raw:
    height: 50px;
    width: 100px;*/
}
 
/*rtl:raw:.test16 {
    color: #EFEFEF;
    left: 10px;
    width: 100%;    
}
 
.test17 {
    transform: translate(10px, 20px);
}
*/

.test18 {
    left: 10px;
    &.test19 {
        color: black;
        margin-left: 20px;
    }
    &.test20 {
        padding: 5px;
        span {
            text-align: left;
        }
    }
}

/*rtl:source:rtl*/
.test19 {
    left: 10px;
    text-align: left;
    width: 50%;
}

.test20[dir="ltr"] {
    text-align: left;
}

.test20[dir="rtl"] {
    text-align: right;
}

.test21 {
    padding:
        env(safe-area-inset-top, 10px)
        env(safe-area-inset-right, 20px)
        env(safe-area-inset-bottom, 30px)
        env(safe-area-inset-left, 40px)
    ;
}

.test22 {
    margin-right: env(safe-area-inset-right, 10px);
    margin-left: env(safe-area-inset-left, 20px);
}
`;