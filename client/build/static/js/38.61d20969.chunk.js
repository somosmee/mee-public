(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[38],{432:function(e,t,n){"use strict";var a=n(17),o=n(0),i=n(34),c=n.n(i),r=n(417),s=n(424),l=n(804),d=n(803),b=n(805),j=n(806),m=n(802),p=n(846),u=n(437),O=n.n(u),h=n(141),v=n(144),x=n(140),y=n(390);var g=Object(y.a)((e=>({root:{paddingTop:e.spacing(2),paddingBottom:e.spacing(2),[e.breakpoints.up("md")]:{paddingTop:e.spacing(3),paddingBottom:e.spacing(3)}},background:{backgroundColor:e.palette.background.default},title:{marginBottom:e.spacing(2),[e.breakpoints.up("md")]:{marginBottom:e.spacing(7)}},loading:{top:e.mixins.toolbar.minHeight},fab:{position:"fixed",bottom:e.spacing(2),right:e.spacing(2),zIndex:e.zIndex.drawer+1},bottomNavigation:{[e.breakpoints.down("md")]:{bottom:e.spacing(10)}},icon:{marginRight:e.spacing(1)},snackbar:{bottom:e.spacing(10),[e.breakpoints.up("md")]:{bottom:e.spacing(2)}},bottom:{bottom:e.spacing(18)}}))),f=n(2);const C=({className:e,children:t,actions:n,fab:i,header:u,toolbar:y,loading:C,placeholder:S,snackbar:I,bottomNavigation:E})=>{const k=g(),N=Object(o.useState)(!1),A=Object(a.a)(N,2),P=A[0],T=A[1],_=Object(o.useContext)(x.b),R=Object(a.a)(_,1)[0],B=e=>t=>{T(!1),e.onClick()},D=!Array.isArray(null===i||void 0===i?void 0:i.actions),L=S;return Object(f.jsxs)(l.a,{className:c()(k.root,e,{[k.background]:!R.prominent}),component:"main",children:[C&&Object(f.jsx)(h.a,{className:k.loading}),!C&&t,!C&&L&&S,i&&D&&Object(f.jsx)(s.a,{display:"block",displayPrint:"none",children:Object(f.jsx)(b.a,{in:D,unmountOnExit:!0,children:Object(f.jsx)(r.a,{className:c()(k.fab,{[k.bottomNavigation]:E}),badgeContent:i.actions.badge,color:"error",children:Object(f.jsxs)(d.a,{id:i.id,disabled:i.disabled,variant:i.actions.variant,color:"primary",onClick:i.actions.onClick,children:[i.actions.icon?Object(o.cloneElement)(i.actions.icon,{className:k.icon}):Object(f.jsx)(O.a,{className:c()({[k.icon]:!!i.actions.label})}),"extended"===i.actions.variant&&i.actions.label]})})})}),i&&!D&&Object(f.jsx)(s.a,{display:"block",displayPrint:"none",children:Object(f.jsx)(b.a,{in:!D,unmountOnExit:!0,children:Object(f.jsx)(r.a,{className:c()(k.fab,{[k.bottomNavigation]:E}),badgeContent:i.actions.badge,overlap:"circle",color:"error",children:Object(f.jsx)(j.a,{id:i.id,open:P,ariaLabel:"A\xe7\xf5es",icon:Object(f.jsx)(p.a,{}),onClick:()=>{T(!P)},children:i.actions.map(((e,t)=>Object(f.jsx)(m.a,{icon:e.icon,tooltipTitle:e.label,tooltipOpen:!0,onClick:B(e)},t)))})})})}),I&&Object(f.jsx)(v.a,{className:c()(k.snackbar,{[k.bottom]:i&&E})})]})};C.defaultProps={header:!0,toolbar:!1,loading:!1,snackbar:!0,bottomNavigation:!0};t.a=C},435:function(e,t,n){"use strict";var a=n(17),o=n(0),i=n(34),c=n.n(i),r=n(140),s=n(41),l=n(8),d=n(390),b=n(19);var j=Object(d.a)((e=>({root:{marginBottom:e.spacing(24),overflowX:"hidden","@media print":{display:"block",margin:"0 !important",padding:"0 !important"}},rootOpen:{[e.breakpoints.up("md")]:{marginLeft:b.b,marginBottom:0,transition:e.transitions.create(["margin","width"],{easing:e.transitions.easing.easeOut,duration:e.transitions.duration.enteringScreen})}},rootClose:{[e.breakpoints.up("md")]:{marginLeft:b.c,marginBottom:0,transition:e.transitions.create(["width","margin"],{easing:e.transitions.easing.sharp,duration:e.transitions.duration.leavingScreen})}},toolbar:Object(l.a)({},e.mixins.toolbar)}))),m=n(2);const p=({children:e,toolbar:t})=>{const n=j(),i=Object(o.useContext)(r.b),l=Object(a.a)(i,1)[0],d=Object(s.a)().app;return Object(m.jsx)("div",{className:c()(n.root,{[n.rootOpen]:d.openDrawer,[n.rootClose]:!d.openDrawer}),children:Object(o.cloneElement)(e,{className:c()({[n.children]:l.overhead})})})};p.defaultProps={toolbar:!0};t.a=p},441:function(e,t,n){"use strict";const a="beacon-container";t.a={showBeacon:()=>{const e=document.getElementById(a);e&&(e.style.display="block")},hideBeacon:()=>{const e=document.getElementById(a);e&&(e.style.display="none")}}},448:function(e,t,n){"use strict";n.d(t,"f",(function(){return u})),n.d(t,"e",(function(){return O})),n.d(t,"h",(function(){return h})),n.d(t,"g",(function(){return v})),n.d(t,"c",(function(){return x})),n.d(t,"d",(function(){return y})),n.d(t,"a",(function(){return g})),n.d(t,"b",(function(){return f}));var a,o,i,c,r,s,l,d,b=n(11),j=n(12),m=n.n(j),p=n(57);const u=m()(a||(a=Object(b.a)(["\n  query me {\n    myCompany {\n      ...companyAttributes\n    }\n  }\n  ","\n"])),p.b),O=m()(o||(o=Object(b.a)(["\n  query me {\n    myCompanies {\n      ...companyAttributes\n    }\n  }\n  ","\n"])),p.b),h=m()(i||(i=Object(b.a)(["\n  mutation($input: UpdateMyCompanyInput!) {\n    updateMyCompany(input: $input) {\n      ...companyAttributes\n    }\n  }\n  ","\n"])),p.b),v=m()(c||(c=Object(b.a)(["\n  mutation($input: SigninCompanyInput!) {\n    signinCompany(input: $input) {\n      token\n      user {\n        ...userAttributes\n      }\n      company {\n        ...companyAttributes\n      }\n    }\n  }\n  ","\n  ","\n"])),p.b,p.d),x=m()(r||(r=Object(b.a)(["\n  mutation($input: CreateMemberInput!) {\n    createMember(input: $input) {\n      ...companyAttributes\n    }\n  }\n  ","\n"])),p.b),y=m()(s||(s=Object(b.a)(["\n  mutation($input: DeleteMemberInput!) {\n    deleteMember(input: $input) {\n      ...companyAttributes\n    }\n  }\n  ","\n"])),p.b),g=m()(l||(l=Object(b.a)(["\n  mutation($input: AcceptInviteInput!) {\n    acceptInvite(input: $input) {\n      token\n      user {\n        ...userAttributes\n      }\n      company {\n        ...companyAttributes\n      }\n    }\n  }\n\n  ","\n  ","\n"])),p.b,p.d),f=m()(d||(d=Object(b.a)(["\n  mutation($input: CreateCompanyInput!) {\n    createCompany(input: $input) {\n      ...companyAttributes\n    }\n  }\n  ","\n"])),p.b)},507:function(e,t,n){"use strict";var a=n(3),o=n(6),i=n(0),c=(n(13),n(7)),r=n(9),s=i.forwardRef((function(e,t){var n=e.disableSpacing,r=void 0!==n&&n,s=e.classes,l=e.className,d=Object(o.a)(e,["disableSpacing","classes","className"]);return i.createElement("div",Object(a.a)({className:Object(c.a)(s.root,l,!r&&s.spacing),ref:t},d))}));t.a=Object(r.a)({root:{display:"flex",alignItems:"center",padding:8},spacing:{"& > :not(:first-child)":{marginLeft:8}}},{name:"MuiCardActions"})(s)},520:function(e,t,n){"use strict";n.d(t,"b",(function(){return l})),n.d(t,"a",(function(){return d})),n.d(t,"c",(function(){return b}));var a,o,i,c=n(11),r=n(12),s=n.n(r);const l=s()(a||(a=Object(c.a)(["\n  mutation($input: CreateSupportCheckoutSessionInput) {\n    createSupportCheckoutSession(input: $input) {\n      session\n    }\n  }\n"]))),d=s()(o||(o=Object(c.a)(["\n  mutation($input: CreateSetupSessionInput) {\n    createSetupSession(input: $input) {\n      session\n    }\n  }\n"]))),b=s()(i||(i=Object(c.a)(["\n  mutation($userBillId: ID!) {\n    retryBillPayment(userBillId: $userBillId) {\n      email\n      billingHistory {\n        items {\n          order {\n            _id\n          }\n          totalOrder\n          fee\n          totalFee\n        }\n        status\n        total\n      }\n    }\n  }\n"])))},546:function(e,t,n){"use strict";var a=n(3),o=n(6),i=n(0),c=(n(13),n(7)),r=n(9),s=n(105),l=i.forwardRef((function(e,t){var n=e.action,r=e.avatar,l=e.classes,d=e.className,b=e.component,j=void 0===b?"div":b,m=e.disableTypography,p=void 0!==m&&m,u=e.subheader,O=e.subheaderTypographyProps,h=e.title,v=e.titleTypographyProps,x=Object(o.a)(e,["action","avatar","classes","className","component","disableTypography","subheader","subheaderTypographyProps","title","titleTypographyProps"]),y=h;null==y||y.type===s.a||p||(y=i.createElement(s.a,Object(a.a)({variant:r?"body2":"h5",className:l.title,component:"span",display:"block"},v),y));var g=u;return null==g||g.type===s.a||p||(g=i.createElement(s.a,Object(a.a)({variant:r?"body2":"body1",className:l.subheader,color:"textSecondary",component:"span",display:"block"},O),g)),i.createElement(j,Object(a.a)({className:Object(c.a)(l.root,d),ref:t},x),r&&i.createElement("div",{className:l.avatar},r),i.createElement("div",{className:l.content},y,g),n&&i.createElement("div",{className:l.action},n))}));t.a=Object(r.a)({root:{display:"flex",alignItems:"center",padding:16},avatar:{flex:"0 0 auto",marginRight:16},action:{flex:"0 0 auto",alignSelf:"flex-start",marginTop:-8,marginRight:-8},content:{flex:"1 1 auto"},title:{},subheader:{}},{name:"MuiCardHeader"})(l)},844:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n(17),i=n(21),c=n(403),r=n(408),s=n(507),l=n(409),d=n(546),b=n(416),j=n(407),m=n(105),p=n(432),u=n(435),O=n(520),h=n(448),v=n(140),x=n(4),y=n(441),g=n(36),f=n(390);var C=Object(f.a)((e=>({root:{},card:{maxWidth:300}}))),S=n(2);var I=()=>{var e,t,n,f,I,E;const k=window.Stripe(Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).REACT_APP_STRIPE_API_KEY),N=Object(a.useContext)(v.b),A=Object(o.a)(N,2)[1],P=C(),T=Object(i.c)(h.f,{fetchPolicy:"network-only",pollInterval:5e3}).data,_=Object(i.b)(O.b),R=Object(o.a)(_,2),B=R[0],D=R[1].data;D&&k.redirectToCheckout({sessionId:D.createSupportCheckoutSession.session}).then((function(e){})),Object(a.useEffect)((()=>{const e="Assist\xeancia e Suporte";A({prominent:!1,overhead:!1,color:"white",title:e.toLowerCase()}),document.title="".concat(e," | Mee"),g.a.logEvent(x.q.SCREEN_VIEW,{screen_name:e})}),[A]),Object(a.useEffect)((()=>{y.a.showBeacon()}));const L=()=>{B({variables:{input:{planType:"standard"}}})},$=()=>{B({variables:{input:{planType:"premium"}}})},F=(null===T||void 0===T||null===(e=T.myCompany)||void 0===e||null===(t=e.subscription)||void 0===t||null===(n=t.plan)||void 0===n?void 0:n.id)===Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).REACT_APP_STRIPE_STANDARD_PLAN,w=(null===T||void 0===T||null===(f=T.myCompany)||void 0===f||null===(I=f.subscription)||void 0===I||null===(E=I.plan)||void 0===E?void 0:E.id)===Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).REACT_APP_STRIPE_PREMIUM_PLAN,q=F||w;return Object(S.jsx)(u.a,{className:P.root,children:Object(S.jsx)(p.a,{children:Object(S.jsxs)(j.a,{container:!0,spacing:3,justify:"center",alignItems:"baseline",children:[Object(S.jsx)(j.a,{item:!0,children:Object(S.jsxs)(r.a,{className:P.card,children:[Object(S.jsx)(d.a,{title:"Iniciante",subheader:"Gr\xe1tis"}),Object(S.jsxs)(l.a,{children:[Object(S.jsx)(m.a,{variant:"overline",display:"block",gutterBottom:!0,children:"Financeiro"}),Object(S.jsx)(b.a,{}),Object(S.jsx)("ul",{children:Object(S.jsx)(m.a,{variant:"body2",color:"secondaryColor",component:"li",children:"Relat\xf3rio simples de vendas"})}),Object(S.jsx)(m.a,{variant:"overline",display:"block",gutterBottom:!0,children:"Vendas"}),Object(S.jsx)(b.a,{}),Object(S.jsxs)("ul",{children:[Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Gerenciamento de pedidos e vendas"}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Emiss\xe3o de Nota Fiscal"})]}),Object(S.jsx)(m.a,{variant:"overline",display:"block",gutterBottom:!0,children:"Clientes"}),Object(S.jsx)(b.a,{}),Object(S.jsx)("ul",{children:Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Gerenciamento cadastro de clientes"})}),Object(S.jsx)(m.a,{variant:"overline",display:"block",gutterBottom:!0,children:"Estoque"}),Object(S.jsx)(b.a,{}),Object(S.jsxs)("ul",{children:[Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Gerenciamento de produtos e estoque"}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Entrada de estoque autom\xe1tica com cupom fiscal da compra"})]}),Object(S.jsx)(m.a,{variant:"overline",display:"block",gutterBottom:!0,children:"Integra\xe7\xf5es"}),Object(S.jsx)(b.a,{}),Object(S.jsx)("ul",{children:Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Integra\xe7\xe3o Vitrine Digital"})})]})]})}),Object(S.jsx)(j.a,{item:!0,children:Object(S.jsxs)(r.a,{className:P.card,elevation:6,children:[Object(S.jsx)(d.a,{title:"Profissional \ud83d\ude80",subheader:"R$ 149,90 por m\xeas (mais vendido)"}),Object(S.jsxs)(l.a,{children:[Object(S.jsx)(m.a,{variant:"overline",display:"block",gutterBottom:!0,children:"Financeiro"}),Object(S.jsx)(b.a,{}),Object(S.jsxs)("ul",{children:[Object(S.jsxs)(m.a,{variant:"body2",component:"li",children:["Relat\xf3rio completo de ",Object(S.jsx)("b",{children:"fluxo de caixa"})]}),Object(S.jsxs)(m.a,{variant:"body2",component:"li",children:["Controle de ",Object(S.jsx)("b",{children:"despesas"})]}),Object(S.jsxs)(m.a,{variant:"body2",component:"li",children:["Controle de ",Object(S.jsx)("b",{children:"faturamento"})]}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Importa\xe7\xe3o autom\xe1tica de despesas com cupom fiscal"})]}),Object(S.jsx)(m.a,{variant:"overline",display:"block",gutterBottom:!0,children:"Vendas"}),Object(S.jsx)(b.a,{}),Object(S.jsxs)("ul",{children:[Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Gerenciamento de pedidos e vendas"}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Emiss\xe3o de Nota Fiscal"}),Object(S.jsx)(m.a,{variant:"body2",color:"secondaryColor",component:"li",children:"Relat\xf3rio ticket m\xe9dio"})]}),Object(S.jsx)(m.a,{variant:"overline",display:"block",gutterBottom:!0,children:"Clientes"}),Object(S.jsx)(b.a,{}),Object(S.jsxs)("ul",{children:[Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Gerenciamento de clientes"}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Hist\xf3rico de vendas por cliente"}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Gerenciamento de fideliza\xe7\xe3o (em breve)"})]}),Object(S.jsx)(m.a,{variant:"overline",display:"block",gutterBottom:!0,children:"Estoque"}),Object(S.jsx)(b.a,{}),Object(S.jsxs)("ul",{children:[Object(S.jsxs)(m.a,{variant:"body2",component:"li",children:[" ","Gerenciamento de produtos e estoque"]}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Alerta de estoque m\xednimo"}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Entrada de estoque autom\xe1tica com cupom fiscal da compra"})]}),Object(S.jsx)(m.a,{variant:"overline",display:"block",gutterBottom:!0,children:"Integra\xe7\xf5es"}),Object(S.jsx)(b.a,{}),Object(S.jsxs)("ul",{children:[Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Integra\xe7\xe3o com iFood"}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Integra\xe7\xe3o com Loggi"}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Integra\xe7\xe3o Vitrine Digital"}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Integra\xe7\xe3o com iFood mercado (em breve)"}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Integra\xe7\xe3o com UberEats (em breve)"}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Integra\xe7\xe3o com Rappi (em breve)"})]})]}),Object(S.jsxs)(s.a,{children:[F&&Object(S.jsx)(c.a,{onClick:L,size:"large",variant:"outlined",color:"primary",disabled:!0,children:"VOC\xca ASSINOU PLANO PROFISSIONAL \u2705"}),!q&&Object(S.jsx)(c.a,{onClick:L,size:"large",variant:"outlined",color:"primary",children:"ASSINAR PLANO PROFISSIONAL"})]})]})}),Object(S.jsx)(j.a,{item:!0,children:Object(S.jsxs)(r.a,{className:P.card,children:[Object(S.jsx)(d.a,{title:"Premium \u2728\ud83d\udd2e",subheader:"R$ 499,90 por m\xeas"}),Object(S.jsxs)(l.a,{children:[Object(S.jsx)(m.a,{variant:"overline",display:"block",gutterBottom:!0,children:"Organiza\xe7\xe3o"}),Object(S.jsx)(b.a,{}),Object(S.jsxs)("ul",{children:[Object(S.jsxs)(m.a,{variant:"body2",component:"li",children:["Gerenciamento de m\xfaltiplos ",Object(S.jsx)("b",{children:"perfis"})," e ",Object(S.jsx)("b",{children:"permiss\xf5es"})," na plataforma"]}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Gerenciamento multi lojas"})]}),Object(S.jsx)(m.a,{variant:"overline",display:"block",gutterBottom:!0,children:"Financeiro"}),Object(S.jsx)(b.a,{}),Object(S.jsxs)("ul",{children:[Object(S.jsxs)(m.a,{variant:"body2",component:"li",children:["Relat\xf3rio completo de ",Object(S.jsx)("b",{children:"fluxo de caixa"})]}),Object(S.jsxs)(m.a,{variant:"body2",component:"li",children:["Controle de ",Object(S.jsx)("b",{children:"despesas"})]}),Object(S.jsxs)(m.a,{variant:"body2",component:"li",children:["Controle de ",Object(S.jsx)("b",{children:"faturamento"})]}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Importa\xe7\xe3o autom\xe1tica de despesas com cupom fiscal"})]}),Object(S.jsx)(m.a,{variant:"overline",display:"block",gutterBottom:!0,children:"Vendas"}),Object(S.jsx)(b.a,{}),Object(S.jsxs)("ul",{children:[Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Gerenciamento de pedidos e vendas"}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Emiss\xe3o de Nota Fiscal"}),Object(S.jsx)(m.a,{variant:"body2",color:"secondaryColor",component:"li",children:"Relat\xf3rio ticket m\xe9dio"})]}),Object(S.jsx)(m.a,{variant:"overline",display:"block",gutterBottom:!0,children:"Clientes"}),Object(S.jsx)(b.a,{}),Object(S.jsxs)("ul",{children:[Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Gerenciamento de clientes"}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Hist\xf3rico de vendas por cliente"}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Gerenciamento de fideliza\xe7\xe3o (em breve)"})]}),Object(S.jsx)(m.a,{variant:"overline",display:"block",gutterBottom:!0,children:"Estoque"}),Object(S.jsx)(b.a,{}),Object(S.jsxs)("ul",{children:[Object(S.jsxs)(m.a,{variant:"body2",component:"li",children:[" ","Gerenciamento de produtos e estoque"]}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Alerta de estoque m\xednimo"}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Entrada de estoque autom\xe1tica com cupom fiscal da compra"})]}),Object(S.jsx)(m.a,{variant:"overline",display:"block",gutterBottom:!0,children:"Integra\xe7\xf5es"}),Object(S.jsx)(b.a,{}),Object(S.jsxs)("ul",{children:[Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Integra\xe7\xe3o com iFood"}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Integra\xe7\xe3o com Loggi"}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Integra\xe7\xe3o Vitrine Digital"}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Integra\xe7\xe3o com iFood mercado (em breve)"}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Integra\xe7\xe3o com UberEats (em breve)"}),Object(S.jsx)(m.a,{variant:"body2",component:"li",children:"Integra\xe7\xe3o com Rappi (em breve)"})]}),Object(S.jsx)(m.a,{variant:"overline",display:"block",gutterBottom:!0,children:"VIP"}),Object(S.jsx)(b.a,{}),Object(S.jsxs)("ul",{children:[Object(S.jsxs)(m.a,{variant:"body2",component:"li",children:[Object(S.jsx)("b",{children:"Conte\xfado exclusivo"})," sobre neg\xf3cio e finan\xe7as"]}),Object(S.jsxs)(m.a,{variant:"body2",component:"li",children:["Atendimento por ",Object(S.jsx)("b",{children:"v\xeddeo chamada"})]}),Object(S.jsxs)(m.a,{variant:"body2",component:"li",children:[Object(S.jsx)("b",{children:"Treinamentos"})," para toda equipe"]}),Object(S.jsxs)(m.a,{variant:"body2",component:"li",children:[Object(S.jsx)("b",{children:"Proriza\xe7\xe3o no atendimento"})," e solu\xe7\xe3o de problema"]}),Object(S.jsxs)(m.a,{variant:"body2",component:"li",children:[Object(S.jsx)("b",{children:"Consultoria de neg\xf3cio"})," e acompanhamento dos indicadores do seu neg\xf3cio"]})]})]}),Object(S.jsxs)(s.a,{children:[w&&Object(S.jsx)(c.a,{onClick:$,size:"large",variant:"outlined",color:"primary",disabled:!0,children:"VOC\xca ASSINOU PLANO PREMIUM \u2705"}),!q&&Object(S.jsx)(c.a,{onClick:$,size:"large",variant:"outlined",color:"primary",children:"ASSINAR PLANO PREMIUM"})]})]})})]})})})};const E=()=>Object(S.jsx)(I,{});E.defaultProps={};t.default=E}}]);
//# sourceMappingURL=38.61d20969.chunk.js.map