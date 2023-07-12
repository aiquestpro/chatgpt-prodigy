import Styled from 'styled-components';

const Div = Styled.div`
    position: relative;
    header{
        box-shadow: 0 2px 30px ${({ theme }) => theme['gray-solid']}10;
        ${({ darkMode }) => (darkMode ? `background: #272B41;` : '')};
        z-index: 999;

        @media print {
            display: none;
        }

        .ant-btn-link{
            ${({ darkMode }) =>
              darkMode
                ? `background: #272B41;border-color: #272B41;color: #7D808D !important`
                : ''};
        }

        .head-example{
            ${({ darkMode }) => (darkMode ? `color: #A8AAB3;` : '')};
        }
        .ant-menu-sub.ant-menu-vertical{
            .ant-menu-item{
                a{
                    color: ${({ theme }) => theme['gray-color']};
                }
            }
        }
        .ant-menu.ant-menu-horizontal{
            display: flex;
            align-items: center;
            margin: 0 -16px;
            li.ant-menu-submenu{
                margin: 0 16px;
            }
            .ant-menu-submenu{
                &.ant-menu-submenu-active,
                &.ant-menu-submenu-selected,
                &.ant-menu-submenu-open{
                    .ant-menu-submenu-title{
                        color: ${({ darkMode }) =>
                          darkMode ? `#fff;` : '#5A5F7D'};
                        svg,
                        i{
                            color: ${({ darkMode }) =>
                              darkMode ? `#fff;` : '#5A5F7D'};
                        }
                    }
                }
                .ant-menu-submenu-title{
                    font-size: 14px;
                    font-weight: 500;
                    color: ${({ darkMode }) =>
                      darkMode ? `#ffffff90;` : '#5A5F7D'};
                    svg,
                    i{
                        color: ${({ darkMode }) =>
                          darkMode ? `#ffffff90;` : '#5A5F7D'};
                    }
                    .ant-menu-submenu-arrow{
                        font-family: "FontAwesome";
                        font-style: normal;
                        ${({ theme }) =>
                          theme.rtl ? 'margin-right' : 'margin-left'}: 6px;
                        &:after{
                            color: ${({ darkMode }) =>
                              darkMode ? `#ffffff90;` : '#9299B8'};
                            content: '\f107';
                            background-color: transparent;
                        }
                    }
                }
            }
        }
       

    }
    .header-more{
        .head-example{
            ${({ darkMode }) => (darkMode ? `color: #A8AAB3;` : '')};
        }
    }
    .customizer-trigger{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        border-radius: ${({ theme }) =>
          theme.rtl ? '0 10px 10px 0' : '10px 0 0 10px'};
        background-color: darkcyan;
        position: fixed;
        ${({ theme }) => (theme.rtl ? 'left' : 'right')}: 0;
        top: 50%;
        transform: translateY(-50%);
        transition: all .3s ease;
        z-index: 999;
        box-shadow: 0 10px 15px rgba(#5F63F2,.20);
        &.show{
            ${({ theme }) => (theme.rtl ? 'left' : 'right')}: 295px;
        }
        @media print {
            display: none;
        }
        svg,
        img{
            width: 20px;
            color: #fff;
            animation: antRotate 3s infinite linear;
        }
    }
    .customizer-wrapper{
        position: fixed;
        top: 0;
        ${({ theme }) => (theme.rtl ? 'left' : 'right')}: 0;
        width: 350px;
        transform: translateX(${({ theme }) =>
          theme.rtl ? '-350px' : '350px'});
        height: 100vh;
        overflow-y: auto;
        background-color: #fff;
        box-shadow: 0 0 30px #9299B810;
        z-index: 99999999999;
        transition: all .3s ease;
        @media only screen and (max-width: 479px){
            width: 280px;
            transform: translateX(${({ theme }) =>
              theme.rtl ? '-280px' : '280px'});
        }
        &.show{
            transform: translateX(0);
        }
    }
    .customizer{
        height: 100%;
        .customizer__head{
            position: relative;
            padding: 18px 24px;
            border-bottom: 1px solid #f0f0f0;
            text-align: left;
            .customizer-close{
                position: absolute;
                right: 15px;
                top: 15px;
                svg,
                i{
                    color: #FF4D4F;
                }
            }
            .customizer__title{
                font-weight: 600;
                color: #272B41;
                font-size: 16px;
                margin-bottom: 2px;
            }
        }
        .customizer__body{
            padding: 25px;
        }
        .customizer__single{
            &:not(:last-child){
                margin-bottom: 35px;
            }
            h4{
                font-weight: 600;
                font-size: 16px;
                margin-bottom: 10px;
                color: #272B41;
            }
        }
    }
    .customizer-list{
        margin: -10px;
        .customizer-list__item{
            position: relative;
            display: inline-block;
            min-height: 60px;
            background-size: cover;
            margin: 10px;
            &.top{
                span.fa{
                    top: 35px;
                }
            }
            &:hover{
                span{
                    color: darkcyan;
                }
            }
            a{
                position: relative;
                display: block;
                &.active{
                    span.fa{
                        display: block;
                    }
                }
                span.fa{
                    display: none;
                    font-size: 16px;
                    margin-top: 0;
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    color: ${({ theme }) => theme['success-color']};
                }
            }
            img{
                width: 100%;
            }
            span{
                display: inline-block;
                margin-top: 15px;
                color: #272B41;
            }
        }
    }
    .striking-logo{
        color:#000;
        font-size: 18px;
        padding-top: 2px;
        padding-left: 3px;
    }
        .social{
            font-weight:500;
        }
        .ninja{
            font-weight:800;
        }
        @media only screen and (max-width: 875px){
            ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 4px;
        }
        @media only screen and (max-width: 767px){
            ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 0;
        }
        img{
            max-width: ${({ theme }) => (theme.topMenu ? '140px' : '120px')};
            width: 100%;
        }
        &.top-menu{
            ${({ theme }) =>
              theme.rtl ? 'margin-right' : 'margin-left'}: 15px;
        }
    
    }
    .social-text-logo{
        font-weight:500;
    }
    .ninja-text-logo{
        font-weight:900;
    }
    
    .certain-category-search-wrapper{
        ${({ darkMode, theme }) =>
          darkMode
            ? `${
                !theme.rtl ? 'border-right' : 'border-left'
              }: 1px solid #272B41;`
            : ''};
         @media only screen and (max-width: 767px){
            padding: 0 15px;
        }
        input{
            max-width: 350px;
            ${({ darkMode }) => (darkMode ? `background: #272B41;` : '')};
            ${({ darkMode }) => (darkMode ? `color: #fff;` : '#5A5F7D')};
            @media only screen and (max-width: 875px){
                ${({ theme }) =>
                  !theme.rtl ? 'padding-left' : 'padding-right'}: 5px;
            }
        }
    }
    
    .navbar-brand{
        button{
            padding: 0 11px 0 10px;
            line-height: 0;
            margin-top: 4px;
            color: #ADB4D2;;
            line-height: 0;
            margin-top: 4px;
            margin-left: -3px;
            color: ${({ theme }) => theme['extra-light-color']};
            @media only screen and (max-width: 875px){
                padding: ${({ theme }) =>
                  theme.rtl ? '0 10px 0 25px' : '0 25px 0 10px'};
            }
            @media only screen and (max-width: 767px){
                padding: ${({ theme }) =>
                  theme.rtl ? '0 0px 0 15px' : '0 15px 0 0px'};
            }
        }
    }

    /* Sidebar styles */
    .ant-layout-sider{
        box-shadow: 0 0 30px #9299B810;
        @media (max-width: 991px){
            box-shadow: 0 0 10px #00000020;
        }
        @media print {
            display: none;
        }
        &.ant-layout-sider-dark{
            background: ${({ theme }) => theme['dark-color']};
            .ant-layout-sider-children{
                .ant-menu{
                    .ant-menu-submenu-inline{
                        > .ant-menu-submenu-title{
                            padding: 0 8px !important;
                        }
                    }
                    .ant-menu-item{
                        padding: 0 8px !important;
                    }
                }
            }
        }
        .ant-layout-sider-children{
            padding-bottom: 15px;
            >.sidebar-nav-title{
                margin-top: 8px;
            }

            .ant-menu{
                overflow-x: hidden;
                .ant-menu-sub.ant-menu-inline{
                    background-color: #fff;
                }
                ${({ theme }) =>
                  theme.rtl ? 'border-left' : 'border-right'}: 0 none;
                .ant-menu-submenu, .ant-menu-item{
                    .feather,
                    img{
                        width: 16px;
                        font-size: 16px;
                        color: ${({ theme }) => theme['extra-light-color']};
                        text-align:center;
                        margin-left:14px;
                    }
                    span{
                        display: inline-block;
                        color: ${({ theme }) => theme['dark-color']};
                        transition: 0.3s ease;
                        margin-left:3px;
                        a{
                            ${({ theme }) =>
                              !theme.rtl
                                ? 'padding-left'
                                : 'padding-right'}: 3px;
                            padding-top:3px;
                        }
                        .leads-link{
                            margin-top:-7px;
                            ${({ theme }) =>
                              !theme.rtl
                                ? 'padding-left'
                                : 'padding-right'}: 3px;
                                transform: translateY(3px);
                        }
                        .pipeline-link {
                            margin-top: 0px;
                        }
                    }
                    .sDash_menu-item-icon{
                        line-height: .6;
                    }
                }
                .ant-menu-submenu{
                    span{
                        ${({ theme }) =>
                          !theme.rtl ? 'padding-left' : 'padding-right'}: 20px;
                    }
                }
                .ant-menu-item{
                    .menuItem-iocn{
                        width: auto;
                    }
                }
                .ant-menu-item,
                .ant-menu-submenu-title{
                    a{
                        position: relative;
                    }
                    >span{
                        width: 100%;
                        .pl-0{
                            ${({ theme }) =>
                              theme.rtl
                                ? 'padding-right'
                                : 'padding-left'}: 0px;
                        }
                    }
                    .badge{
                        position: absolute;                        
                        ${({ theme }) => (theme.rtl ? 'left' : 'right')}: 30px;
                        top: 50%;
                        transform: translateY(-50%);
                        display: inline-block;
                        height: auto;
                        font-size: 10px;
                        border-radius: 3px;
                        padding: 3px 4px 4px;
                        line-height: 1;
                        letter-spacing: 1px;
                        color: #fff;
                        &.badge-primary{
                            background-color: ${({ theme }) =>
                              theme['primary-color']};
                        }
                        &.badge-success{
                            background-color: ${({ theme }) =>
                              theme['success-color']};
                        }
                    }
                }
                .ant-menu-submenu{
                    .ant-menu-submenu-title{
                        display: flex;
                        align-items: center;
                        .title{
                            padding-left: 0;
                        }
                        .badge{
                            ${({ theme }) =>
                              theme.rtl ? 'left' : 'right'}: 45px;
                        }
                    }
                }
                .ant-menu-submenu-inline{
                    > .ant-menu-submenu-title{
                        display: flex;
                        align-items: center;
                        svg,
                        img{
                            width: 16px;
                            height: 16px;
                        }
                                                
                        .ant-menu-submenu-arrow{
                            right: auto;
                            ${({ theme }) =>
                              theme.rtl ? 'left' : 'right'}: 24px;
                            &:after,
                            &:before{
                                width: 7px;
                                background: #868EAE;
                                height: 1.25px;
                            }
                            &:before{
                                transform: rotate(45deg) ${({ theme }) =>
                                  !theme.rtl
                                    ? 'translateY(-3.3px)'
                                    : 'translateY(3.3px)'};
                            }
                            &:after{
                                transform: rotate(-45deg) ${({ theme }) =>
                                  theme.rtl
                                    ? 'translateY(-3.3px)'
                                    : 'translateY(3.3px)'};
                            }
                        }
                    }
                    &.ant-menu-submenu-open{
                        > .ant-menu-submenu-title{
                            .ant-menu-submenu-arrow{
                                transform: translateY(2px);
                                &:before{
                                    transform: rotate(45deg) translateX(-3.3px);
                                }
                                &:after{
                                    transform: rotate(-45deg) translateX(3.3px);
                                }
                            }
                        }
                    }
                    .ant-menu-item{
                        ${({ theme }) =>
                          theme.rtl
                            ? 'padding-right'
                            : 'padding-left'}: 0px !important;
                        ${({ theme }) =>
                          theme.rtl
                            ? 'padding-left'
                            : 'padding-right'}: 0 !important;
                        transition: all 0.2s cubic-bezier(0.215, 0.61, 0.355, 1) 0s;
                        a{
                            ${({ theme }) =>
                              theme.rtl
                                ? 'padding-right'
                                : 'padding-left'}: 50px !important;
                        }
                    }
                }
                .ant-menu-item{
                    display: flex;
                    align-items: center;
                    padding: 0px 0px 0px !important;
                    &.ant-menu-item-active{
                        border-radius: 4px;
                        ${({ darkMode }) =>
                          darkMode
                            ? `background-color: rgba(255, 255, 255, .05);`
                            : ''};
                    }
                    a{
                        width: 100%;
                        display: flex !important;
                        align-items: center;
                        .feather{
                            width: 16px;
                            color: ${({ theme }) => theme['extra-light-color']};
                        }
                        span{
                            ${({ theme }) =>
                              !theme.rtl
                                ? 'padding-left'
                                : 'padding-right'}: 20px;
                            display: inline-block;
                            color: ${({ theme }) => theme['dark-color']};
                        }
                    }
                    &.ant-menu-item-selected{
                        svg,
                        i{
                            color: ${({ theme }) =>
                              theme['primary-color']} !important;
                        }
                    }
                }
                .ant-menu-submenu,
                .ant-menu-item{
                    ${({ theme }) => theme.rtl && `padding-right: 5px;`}
                    
                    &.ant-menu-item-selected{
                        border-radius: 4px;
                        margin:0px 8px ;
                        &:after{
                            content: none;
                        }
                    }
                    &.ant-menu-submenu-active{
                        border-radius: 4px;
                        ${({ darkMode }) =>
                          darkMode
                            ? `background-color: rgba(255, 255, 255, .05);`
                            : ''};
                    }
                }
                .sidebar-nav-title{
                    margin-top: 40px;
                    margin-bottom: 24px;
                }
                &.ant-menu-inline-collapsed{
                    .ant-menu-submenu{
                        text-align: ${({ theme }) =>
                          !theme.rtl
                            ? 'left'
                            : 'right'};                        
                        .ant-menu-submenu-title{
                            padding: 0 20px;
                            justify-content: center;
                        }
                    }
                    .ant-menu-item{
                        padding: 0 20px !important;
                        justify-content: center;
                    }
                    .ant-menu-submenu, .ant-menu-item{
                        span{
                            display: none;
                        }
                    }
                }
            }
        }
        .sidebar-nav-title{
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
            ${({ darkMode }) =>
              darkMode
                ? `color: rgba(255, 255, 255, .38);`
                : 'color: #9299B8;'};
            padding: 0 ${({ theme }) => (theme.rtl ? '20px' : '15px')};
            display: flex;
        }
        &.ant-layout-sider-collapsed{
            padding: 15px 0px 55px !important;
            .sidebar-nav-title{
                display: none;
            }
            & + .atbd-main-layout{
                margin-left: 101px;
                margin-right: 24px;
            }
            .ant-menu-item{
                color: #333;
                .badge{
                    display: none;
                }
            }
        }
    }
    .ant-layout-{
        width:100%;
        height:100vh;
        over-flow:auto;
    }
    @media only screen and (max-width: 1150px){
        .ant-layout-sider.ant-layout-sider-collapsed{
            ${({ theme }) => (!theme.rtl ? 'left' : 'right')}: -80px !important;
        }

    }

    .atbd-main-layout{
        ${({ theme }) => (!theme.rtl ? 'margin-left' : 'margin-right')}: ${({
  theme,
}) => (theme.topMenu ? 0 : '214px')};
        margin-top: 47px;
        ${({ theme }) => (!theme.rtl ? 'margin-left' : 'margin-right')}: ${({
  theme,
}) => (theme.topMenu ? 0 : '246px')};
        margin-top: 42px;
        margin-right:24px;
        transition: 0.3s ease;
        @media only screen and (max-width: 1150px){
            ${({ theme }) =>
              !theme.rtl ? 'margin-left' : 'margin-right'}: auto !important;
        }
        @media print {
            width: 100%;
            margin-left: 0;
            margin-right: 0;
        }
    }
    .ant-layout-footer{
        padding: 20px 30px 18px;
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        background: aliceblue;
        width: 84vw !important;
        display:none;
    }

    /* Mobile Actions */
    .mobile-action{
        position: absolute;
        ${({ theme }) => (theme.rtl ? 'left' : 'right')}: 20px;
        top: 50%;
        transform: translateY(-50%);
        display: inline-flex;
        align-items: center;
        @media only screen and (max-width: 767px){
            ${({ theme }) => (theme.rtl ? 'left' : 'right')}: 0;
        }
        a{
            display: inline-flex;
            color: ${({ theme }) => theme['light-color']};
            &.btn-search{
                ${({ theme }) =>
                  theme.rtl ? 'margin-left' : 'margin-right'}: 18px;
            }
            svg{
                width: 20px
                height: 20px;
            }
        }
    }
    .admin-footer{
        @media print {
            display: none;
        }
        .admin-footer__copyright{
            display: inline-block;
            width: 100%;
            color: ${({ theme }) => theme['light-color']};
            @media only screen and (max-width: 767px){
                text-align: center;
                margin-bottom: 10px;
            }
        }
        .admin-footer__links{
            text-align: ${({ theme }) => (theme.rtl ? 'left' : 'right')};
            @media only screen and (max-width: 767px){
                text-align: center;
            }
            a{
                color: ${({ theme }) => theme['light-color']};
                &:not(:last-child){
                    ${({ theme }) =>
                      theme.rtl ? 'margin-left' : 'margin-right'}: 15px;
                }
                &:hover{
                    color: ${({ theme }) => theme['primary-color']};
                }
            }
        }
    }
    .App {
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        text-align: center;
        height: 100%;
        padding: 10px;
        background-color: #282c34;
      }
      
      .ant-modal.create-messenger-edit-lead-modal .ant-modal-body {
        padding: 0px;
      }
      
      .ant-modal.create-messenger-edit-lead-modal .ant-modal-content .ant-modal-header {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        padding: 19px 16px;
      }
      
      .ant-modal.create-messenger-edit-lead-modal .ant-modal-content {
        width: 722px;
        height: 100%;
        position: relative;
        right: 200px;
        border-radius: 8px;
      }
      
      .ant-modal.add-to-pipeline-modal .ant-modal-content {
        width: 722px;
        height: 100px;
        position: relative;
        right: 200px;
        border-radius: 8px;
      }
      .ant-modal.create-messenger-edit-lead-modal.messenger-assign-lead-modal .ant-modal-content {
        right: 184px !important;
      }
      
      .ant-modal.create-messenger-edit-lead-modal.messenger-assign-lead-modal .ant-modal-content .pipeline-modal-label.checkbox-item-wrapper label {
        margin: 0px !important;
        color: #272b41 !important;
      }
      
      .ant-modal.create-messenger-edit-lead-modal.messenger-assign-lead-modal .ant-modal-content .pipeline-modal-label.checkbox-item-wrapper {
        display: flex;
        align-items: center;
        width: 389px;
        padding: 0px 0px;
      }
      
      .ant-modal.create-messenger-edit-lead-modal.messenger-assign-lead-modal .ant-modal-content .ant-select {
        width: 260px;
      }
      
      .ant-modal.create-messenger-edit-lead-modal.messenger-assign-lead-modal .ant-modal-content h2.mb-3.text-center.color-dark.pipeline-modal-heading span {
        font-size: 24px;
        font-weight: 700;
        letter-spacing: 0em;
        line-height: 0px !important;
        text-align: center;
      }
      
      .ant-modal.create-messenger-edit-lead-modal.messenger-assign-lead-modal .ant-modal-content label {
        font-family: Inter;
        font-size: 12px;
        font-weight: 500;
        line-height: 15px;
        letter-spacing: 0em;
        text-align: left;
        color: #272b41 !important;
        margin: 0px;
      }
      
      .ant-modal.create-messenger-edit-lead-modal.messenger-assign-lead-modal .ant-modal-content .modal-footer.d-flex.justify-content-center button:nth-child(1) {
        border: 1px solid #e3e6ef;
        background: transparent;
        font-size: 14px;
        font-weight: 700;
        line-height: 17px;
        letter-spacing: 0em;
        text-align: left;
        color: #9299b8;
      }
      
      .ant-modal.create-messenger-edit-lead-modal.messenger-assign-lead-modal .ant-modal-content .modal-footer.d-flex.justify-content-center button:nth-child(2):hover {
        color: #5f63f2;
        background: #fff;
      }
      
      .ant-modal.create-messenger-edit-lead-modal.messenger-assign-lead-modal .ant-modal-content .modal-footer.d-flex.justify-content-center button:nth-child(2) {
        border: 1px solid #e3e6ef;
        background: #5f63f2;
        font-size: 14px;
        font-weight: 700;
        line-height: 17px;
        letter-spacing: 0em;
        text-align: left;
        color: #fff;
        border-radius: 4px;
      }
      
      .ant-modal.create-messenger-edit-lead-modal.messenger-assign-lead-modal .ant-modal-content {
        width: 100%;
        right: 82px;
      }
      
      .create-messenger-edit-lead-modal .ant-modal-title {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
        line-height: 28px;
        letter-spacing: 0em;
        text-align: left;
        color: #000000;
        font-family: inter, sans-serif !important;
      }
      
      .ant-modal.create-messenger-edit-lead-modal .ant-modal-content .ant-modal-body {
        padding-bottom: 0px !important;
      }
      
      .ant-modal.create-messenger-edit-lead-modal .ant-modal-content {
        width: 722px;
        height: 100%;
        position: relative;
        right: 200px;
        border-radius: 8px;
      }
      
      .ant-modal.create-messenger-edit-lead-modal .ant-modal-content .ant-modal-body {
        padding-bottom: 0px !important;
      }
      
      body {
        width: 500px;
        height: 400px;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
          sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      
        position: relative;
      }
      
      code {
        font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
          monospace;
      }
      
      .loader-wrapper {
        display: flex;
        justify-content: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) !important;
      }
      
      .sideBar {
        background: darkcyan;
        margin: 0px 0px 0px;
        padding: 0px 0px 0px;
        overflow: auto;
        height: calc(100%);
        left: 0px;
        z-index: 4;
        flex: 0 0 100px;
        max-width: 120px;
        min-width: 120px;
        width: 120px;
      }
      
      .App-logo {
        height: 30vmin;
        pointer-events: none;
      }
      
      @media (prefers-reduced-motion: no-preference) {
        .App-logo {
          animation: App-logo-spin infinite 20s linear;
        }
      }
      
      .App-header {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: calc(10px + 2vmin);
        color: white;
      }
      
      .App-link {
        color: #61dafb;
      }

      .home-article-wrap {
        border: 1px solid;
        padding: 5px;
        border-radius: 8px;
      }

      .heading-chat-wrap {
        display: flex !important;
        justify-content: space-between !important;
      }
      
      .menu-items {
        color: #ffffff;
        background-color: darkcyan;
        font-size: 14px;
        padding: 0 0 0 0;
        margin: 10px 2px 0px 0px;
      }
      
      .item {
        margin-top: 0px;
      }
      
      .resource-icon {
        border-radius: 5px;
        color: #ffffff;
        font-size: 12px;
      }
      
      .popup-resource {
        margin: 218px 16px 0px 16px;
      }
      
      .support {
        color: #ffffff;
        font-size: 12px;
        margin-left: 5px;
      }
      
      .chat {
        color: #ffffff;
        font-size: 16px;
        font-weight: 600;
        line-height: 22px;
        letter-spacing: 0em;
        text-align: left;
      }
      
      .pro {
        color: #ffffff;
        font-size: 16px;
        font-weight: 800;
        line-height: 22px;
        letter-spacing: 0em;
        text-align: left;
      }
      
      .social {
        margin: 20px 2px 10px 17px !important;
      }
      
      @keyframes App-logo-spin {
        from {
          transform: rotate(0deg);
        }
      
        to {
          transform: rotate(360deg);
        }
      }
      
      
      .menuBar {
        background-color: #ffffff !important;
        padding: 0px 20px 0px 0px;
        border-bottom: solid 1px #e8e8e8;
        overflow: auto;
        box-shadow: 0 0 30px #f3f1f1;
      }
      
      .logo {
        width: 150px;
        float: left;
      }
      
      .user-modal {
        border-radius: 30px;
        margin-top: 5px;
        justify-content: flex-end;
        margin-bottom: 5px;
      }
      
      .chat-home {
        margin-left: 24px;
        font-size: 16px;
        font-weight: 600;
        line-height: 19px;
        letter-spacing: 0em;
        text-align: left;
        display: flex;
        align-items: center;
        margin-bottom: 14px;
      }
      
      .menuCon {
        display: flex;
        float: left;
        width: 100%;
        height: 50px;
        justify-content: space-between;
      }
      
      .menuCon .ant-menu-item {
        padding: 0px 5px;
      }
      
      .menuCon .ant-menu-submenu-title {
        padding: 10px 20px;
      }
      
      .menuCon .ant-menu-item a,
      .menuCon .ant-menu-submenu-title a {
        padding: 10px 15px;
      }
      
      .menuCon .ant-menu-horizontal {
        border-bottom: none;
      }
      
      .menuCon .leftMenu {
        float: left;
      }
      
      .menuCon .rightMenu {
        float: right;
      }
      
      img.social-icons-wrapper.position-absolute {
        position: absolute;
        top: 29px;
        right: 18px;
      }
      
      @media (max-width: 767px) {
        .barsMenu {
          display: inline-block;
        }
      
        .leftMenu,
        .rightMenu {
          display: none;
        }
      
        .logo a {
          margin-left: -20px;
        }
      
        .menuCon .ant-menu-item,
        .menuCon .ant-menu-submenu-title {
          padding: 1px 20px;
        }
      
        .logo a {
          padding: 10px 20px;
        }
      }
      
      .logged-div {
        position: fixed;
        z-index: 10;
        width: 100%;
        height: 100%;
        background: rgb(255, 255, 255);
        top: 0;
        left: 0;
        line-height: 1.5em;
      }
      
      .licensing-form {
        margin: 70px 150px !important;
      }
      
      .heading-log {
        font-size: 28px;
        display: flex;
        color: rgb(95, 99, 242);
      }
      
      .heading-log-flex {
        display: flex;
        max-width: 466px;
        font-weight: 600;
      }
      
      .heading-log-bold {
        color: rgb(95, 99, 242);
        font-size: 32px;
        font-weight: bold;
      }
      
      .label-log {
        font-size: 20px;
      }
      
      
      
      
      
      
      
      .home-div {
        display: block;
        padding: 19px;
        height: 350px !important;
        width: 430px !important;
        overflow: auto;
      }

      .home-div-empty {
        display: block;
        padding: 10px;
        height: 350px !important;
        width: 430px !important;
      }
      
      .home-div ul li {
        color: #1b91ff;
      }
      
      .home-div-wrapper {
        display: block;
        padding: 24px;
      }
      
      .home-pro {
        color: darkcyan;
        font-size: 14px;
        font-weight: 800;
        line-height: 17px;
        letter-spacing: 0em;
        text-align: left;
      }

      .home-active-pro {
        margin-top: 20px
      }
      
      .home-space {
        margin-top: 12px;
        margin-right: 1px;
      }
      
      .ant-div-main-wrap {
        display: flex !important;
      }
      
      .ant-layout {
        flex: none !important;
        background-color: darkcyan !important;
      }
      
      .ant-layout-sider {
        background: none !important;
      }
      
      .sideBar {
        height: 388px;
      }
      
      .video-span {
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        letter-spacing: 0px;
        text-align: left;
        display: block;
        margin-right: 13px;
      }
      
      .ant-menu-vertical .ant-menu-item {
        width: auto !important;
      }    
`;

const HeaderSelect = Styled.div`
  margin:12px 0px 0;
  display:flex;
  align-items: center;
  .ant-select{
    width:120px;
    box-shadow: 0 3px 5px #9299b805;
  }
  .syncFriendsData{
 margin-top: 18px;
 margin-bottom: 16px;
 margin-right:16px;
 min-width:200px;

  }
  button{
      &:hover{
          background: darkcyan !important;
          color:#fff !important;
          transition: 0.3s !important;
      }
  }
  .table-select{
    border: 1px solid #F1F2F6;
    width:123px;
    .ant-select-selector{
        padding:0 2px!important;
    }
  }
  .ant-select.table-select.table-select-margin.ant-select-single.ant-select-show-arrow {
    margin: 0 -12px;
}
  .ant-select{
      color:#5A5F7D;
      font-weight:400;
      font-size:${({ theme }) => theme['card-padding-base']} ;
  }
  .ant-select:not(.ant-select-customize-input) .ant-select-selector{
      border-radius: 5px !important;
      border:none!important;
  }
  .ant-select-single:not(.ant-select-customize-input) .ant-select-selector{
      height:32px!important;
  }
  .ant-select-selector{
    border-color: ${({ theme }) => theme['border-color-light']};
  }
  .ant-select-multiple.ant-select-sm{
    .ant-select-selection-item{
      height: 20px;
      line-height: 18px;
      font-size: 11px;
    }
  }
  .ant-select-arrow {
    top: 55%;
    right: 10px;
    width: 8px; 
    height: 4px;
    margin-top: -6px;
    color: rgb(100 104 132);
    font-size: 10px;
}

`;

export { Div, HeaderSelect };
