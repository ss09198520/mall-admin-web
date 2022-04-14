<!-- 漏斗圖 -->
<template>
  <div
      :id="id"
      :class="className"
      :style="{height, width}"
  >
    <h2>Force-Direct Graph IIII</h2>
    <el-form
        class="login-form"
        auto-complete="on"
        label-position="left"
    >
      <el-form-item prop="code">
         <span class="svg-container">
            <svg-icon icon-class="validCode"/>
          </span>
        <el-input
            v-model="filterStr"
            auto-complete="off"
            :placeholder="'輸入篩選條件'"
            style="width: 15%"
            @keyup="filterData"
        />
      </el-form-item>

      <el-button
          type="success"
          @click="()=>alert(1)"
          autofocus
          style="float: left;"
      >
        清空條件
      </el-button>
    </el-form>


  </div>
</template>

<script setup>
import {
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  reactive,
  toRaw,
  toRef,
  toRefs,
  unref
} from "vue";

import {ElForm, ElInput} from "element-plus";
import SvgIcon from '@/components/SvgIcon/index.vue';

import * as d3 from 'd3';
import resize from '@/utils/resize'
// API依賴
import {graphMovieByTitle , graphMovie} from "@/api/system/movie";

const props = defineProps({
    id: {
      type: String,
      default: 'ForceDirectGraph'
    },
    relationship: {
      type: Object,
      default : () => null
    },
    className: {
      type: String,
      default: 'container-border'
    },
    width: {
      type: String,
      default: '960px',
      required: true
    },
    height: {
      type: String,
      default: '600px',
      required: true
    }
  })

  const {
    mounted,
    chart,
    beforeDestroy,
    activated,
    deactivated
  } = resize()

  // ref聲明响應式數據，用于聲明基本數據類型
  // const name = ref('Jerry')
  // // 修改
  // name.value = 'Tom'
  //
  // // reactive聲明响應式數據，用于聲明引用數據類型
  // const state2 = reactive({
  //   name2: 'Jerry',
  //   sex: '男'
  // })

  // 修改
  // state2.name2 = 'Tom'
  // 使用
const iconMapData = {'glass':'f000','music':'f001','search':'f002','envelope-o':'f003','heart':'f004','star':'f005','star-o':'f006','user':'f007','film':'f008','th-large':'f009','th':'f00a','th-list':'f00b','check':'f00c','remove,close,times':'f00d','search-plus':'f00e','search-minus':'f010','power-off':'f011','signal':'f012','gear,cog':'f013','trash-o':'f014','home':'f015','file-o':'f016','clock-o':'f017','road':'f018','download':'f019','arrow-circle-o-down':'f01a','arrow-circle-o-up':'f01b','inbox':'f01c','play-circle-o':'f01d','rotate-right,repeat':'f01e','refresh':'f021','list-alt':'f022','lock':'f023','flag':'f024','headphones':'f025','volume-off':'f026','volume-down':'f027','volume-up':'f028','qrcode':'f029','barcode':'f02a','tag':'f02b','tags':'f02c','book':'f02d','bookmark':'f02e','print':'f02f','camera':'f030','font':'f031','bold':'f032','italic':'f033','text-height':'f034','text-width':'f035','align-left':'f036','align-center':'f037','align-right':'f038','align-justify':'f039','list':'f03a','dedent,outdent':'f03b','indent':'f03c','video-camera':'f03d','photo,image,picture-o':'f03e','pencil':'f040','map-marker':'f041','adjust':'f042','tint':'f043','edit,pencil-square-o':'f044','share-square-o':'f045','check-square-o':'f046','arrows':'f047','step-backward':'f048','fast-backward':'f049','fast-movie':'f008','backward':'f04a','play':'f04b','pause':'f04c','stop':'f04d','forward':'f04e','fast-forward':'f050','step-forward':'f051','eject':'f052','chevron-left':'f053','chevron-right':'f054','plus-circle':'f055','minus-circle':'f056','times-circle':'f057','check-circle':'f058','question-circle':'f059','info-circle':'f05a','crosshairs':'f05b','times-circle-o':'f05c','check-circle-o':'f05d','ban':'f05e','arrow-left':'f060','arrow-right':'f061','arrow-up':'f062','arrow-down':'f063','mail-forward,share':'f064','expand':'f065','compress':'f066','plus':'f067','minus':'f068','asterisk':'f069','exclamation-circle':'f06a','gift':'f06b','leaf':'f06c','fire':'f06d','eye':'f06e','eye-slash':'f070','warning,exclamation-triangle':'f071','plane':'f072','calendar':'f073','random':'f074','comment':'f075','magnet':'f076','chevron-up':'f077','chevron-down':'f078','retweet':'f079','shopping-cart':'f07a','folder':'f07b','folder-open':'f07c','arrows-v':'f07d','arrows-h':'f07e','bar-chart-o,bar-chart':'f080','twitter-square':'f081','facebook-square':'f082','camera-retro':'f083','key':'f084','gears,cogs':'f085','comments':'f086','thumbs-o-up':'f087','thumbs-o-down':'f088','star-half':'f089','heart-o':'f08a','sign-out':'f08b','linkedin-square':'f08c','thumb-tack':'f08d','external-link':'f08e','sign-in':'f090','trophy':'f091','github-square':'f092','upload':'f093','lemon-o':'f094','phone':'f095','square-o':'f096','bookmark-o':'f097','phone-square':'f098','twitter':'f099','facebook-f,facebook':'f09a','github':'f09b','unlock':'f09c','credit-card':'f09d','feed,rss':'f09e','hdd-o':'f0a0','bullhorn':'f0a1','bell':'f0f3','certificate':'f0a3','hand-o-right':'f0a4','hand-o-left':'f0a5','hand-o-up':'f0a6','hand-o-down':'f0a7','arrow-circle-left':'f0a8','arrow-circle-right':'f0a9','arrow-circle-up':'f0aa','arrow-circle-down':'f0ab','globe':'f0ac','wrench':'f0ad','tasks':'f0ae','filter':'f0b0','briefcase':'f0b1','arrows-alt':'f0b2','group,users':'f0c0','chain,link':'f0c1','cloud':'f0c2','flask':'f0c3','cut,scissors':'f0c4','copy,files-o':'f0c5','paperclip':'f0c6','save,floppy-o':'f0c7','square':'f0c8','navicon,reorder,bars':'f0c9','list-ul':'f0ca','list-ol':'f0cb','strikethrough':'f0cc','underline':'f0cd','table':'f0ce','magic':'f0d0','truck':'f0d1','pinterest':'f0d2','pinterest-square':'f0d3','google-plus-square':'f0d4','google-plus':'f0d5','money':'f0d6','caret-down':'f0d7','caret-up':'f0d8','caret-left':'f0d9','caret-right':'f0da','columns':'f0db','unsorted,sort':'f0dc','sort-down,sort-desc':'f0dd','sort-up,sort-asc':'f0de','envelope':'f0e0','linkedin':'f0e1','rotate-left,undo':'f0e2','legal,gavel':'f0e3','dashboard,tachometer':'f0e4','comment-o':'f0e5','comments-o':'f0e6','flash,bolt':'f0e7','sitemap':'f0e8','umbrella':'f0e9','paste,clipboard':'f0ea','lightbulb-o':'f0eb','exchange':'f0ec','cloud-download':'f0ed','cloud-upload':'f0ee','user-md':'f0f0','stethoscope':'f0f1','suitcase':'f0f2','bell-o':'f0a2','coffee':'f0f4','cutlery':'f0f5','file-text-o':'f0f6','building-o':'f0f7','hospital-o':'f0f8','ambulance':'f0f9','medkit':'f0fa','fighter-jet':'f0fb','beer':'f0fc','h-square':'f0fd','plus-square':'f0fe','angle-double-left':'f100','angle-double-right':'f101','angle-double-up':'f102','angle-double-down':'f103','angle-left':'f104','angle-right':'f105','angle-up':'f106','angle-down':'f107','desktop':'f108','laptop':'f109','tablet':'f10a','mobile-phone,mobile':'f10b','circle-o':'f10c','quote-left':'f10d','quote-right':'f10e','spinner':'f110','circle':'f111','mail-reply,reply':'f112','github-alt':'f113','folder-o':'f114','folder-open-o':'f115','smile-o':'f118','frown-o':'f119','meh-o':'f11a','gamepad':'f11b','keyboard-o':'f11c','flag-o':'f11d','flag-checkered':'f11e','terminal':'f120','code':'f121','mail-reply-all,reply-all':'f122','star-half-empty,star-half-full,star-half-o':'f123','location-arrow':'f124','crop':'f125','code-fork':'f126','unlink,chain-broken':'f127','question':'f128','info':'f129','exclamation':'f12a','superscript':'f12b','subscript':'f12c','eraser':'f12d','puzzle-piece':'f12e','microphone':'f130','microphone-slash':'f131','shield':'f132','calendar-o':'f133','fire-extinguisher':'f134','rocket':'f135','maxcdn':'f136','chevron-circle-left':'f137','chevron-circle-right':'f138','chevron-circle-up':'f139','chevron-circle-down':'f13a','html5':'f13b','css3':'f13c','anchor':'f13d','unlock-alt':'f13e','bullseye':'f140','ellipsis-h':'f141','ellipsis-v':'f142','rss-square':'f143','play-circle':'f144','ticket':'f145','minus-square':'f146','minus-square-o':'f147','level-up':'f148','level-down':'f149','check-square':'f14a','pencil-square':'f14b','external-link-square':'f14c','share-square':'f14d','compass':'f14e','toggle-down,caret-square-o-down':'f150','toggle-up,caret-square-o-up':'f151','toggle-right,caret-square-o-right':'f152','euro,eur':'f153','gbp':'f154','dollar,usd':'f155','rupee,inr':'f156','cny,rmb,yen,jpy':'f157','ruble,rouble,rub':'f158','won,krw':'f159','bitcoin,btc':'f15a','file':'f15b','file-text':'f15c','sort-alpha-asc':'f15d','sort-alpha-desc':'f15e','sort-amount-asc':'f160','sort-amount-desc':'f161','sort-numeric-asc':'f162','sort-numeric-desc':'f163','thumbs-up':'f164','thumbs-down':'f165','youtube-square':'f166','youtube':'f167','xing':'f168','xing-square':'f169','youtube-play':'f16a','dropbox':'f16b','stack-overflow':'f16c','instagram':'f16d','flickr':'f16e','adn':'f170','bitbucket':'f171','bitbucket-square':'f172','tumblr':'f173','tumblr-square':'f174','long-arrow-down':'f175','long-arrow-up':'f176','long-arrow-left':'f177','long-arrow-right':'f178','apple':'f179','windows':'f17a','android':'f17b','linux':'f17c','dribbble':'f17d','skype':'f17e','foursquare':'f180','trello':'f181','female':'f182','male':'f183','gittip,gratipay':'f184','sun-o':'f185','moon-o':'f186','archive':'f187','bug':'f188','vk':'f189','weibo':'f18a','renren':'f18b','pagelines':'f18c','stack-exchange':'f18d','arrow-circle-o-right':'f18e','arrow-circle-o-left':'f190','toggle-left,caret-square-o-left':'f191','dot-circle-o':'f192','wheelchair':'f193','vimeo-square':'f194','turkish-lira,try':'f195','plus-square-o':'f196','space-shuttle':'f197','slack':'f198','envelope-square':'f199','wordpress':'f19a','openid':'f19b','institution,bank,university':'f19c','mortar-board,graduation-cap':'f19d','yahoo':'f19e','google':'f1a0','reddit':'f1a1','reddit-square':'f1a2','stumbleupon-circle':'f1a3','stumbleupon':'f1a4','delicious':'f1a5','digg':'f1a6','pied-piper-pp':'f1a7','pied-piper-alt':'f1a8','drupal':'f1a9','joomla':'f1aa','language':'f1ab','fax':'f1ac','building':'f1ad','child':'f1ae','paw':'f1b0','spoon':'f1b1','cube':'f1b2','cubes':'f1b3','behance':'f1b4','behance-square':'f1b5','steam':'f1b6','steam-square':'f1b7','recycle':'f1b8','automobile,car':'f1b9','cab,taxi':'f1ba','tree':'f1bb','spotify':'f1bc','deviantart':'f1bd','soundcloud':'f1be','database':'f1c0','file-pdf-o':'f1c1','file-word-o':'f1c2','file-excel-o':'f1c3','file-powerpoint-o':'f1c4','file-photo-o,file-picture-o,file-image-o':'f1c5','file-zip-o,file-archive-o':'f1c6','file-sound-o,file-audio-o':'f1c7','movie,file-movie-o,file-video-o':'f1c8','file-code-o':'f1c9','vine':'f1ca','codepen':'f1cb','jsfiddle':'f1cc','life-bouy,life-buoy,life-saver,support,life-ring':'f1cd','circle-o-notch':'f1ce','ra,resistance,rebel':'f1d0','ge,empire':'f1d1','git-square':'f1d2','git':'f1d3','y-combinator-square,yc-square,hacker-news':'f1d4','tencent-weibo':'f1d5','qq':'f1d6','wechat,weixin':'f1d7','send,paper-plane':'f1d8','send-o,paper-plane-o':'f1d9','history':'f1da','circle-thin':'f1db','header':'f1dc','paragraph':'f1dd','sliders':'f1de','share-alt':'f1e0','share-alt-square':'f1e1','bomb':'f1e2','soccer-ball-o,futbol-o':'f1e3','tty':'f1e4','binoculars':'f1e5','plug':'f1e6','slideshare':'f1e7','twitch':'f1e8','yelp':'f1e9','newspaper-o':'f1ea','wifi':'f1eb','calculator':'f1ec','paypal':'f1ed','google-wallet':'f1ee','cc-visa':'f1f0','cc-mastercard':'f1f1','cc-discover':'f1f2','cc-amex':'f1f3','cc-paypal':'f1f4','cc-stripe':'f1f5','bell-slash':'f1f6','bell-slash-o':'f1f7','trash':'f1f8','copyright':'f1f9','at':'f1fa','eyedropper':'f1fb','paint-brush':'f1fc','birthday-cake':'f1fd','area-chart':'f1fe','pie-chart':'f200','line-chart':'f201','lastfm':'f202','lastfm-square':'f203','toggle-off':'f204','toggle-on':'f205','bicycle':'f206','bus':'f207','ioxhost':'f208','angellist':'f209','cc':'f20a','shekel,sheqel,ils':'f20b','meanpath':'f20c','buysellads':'f20d','connectdevelop':'f20e','dashcube':'f210','forumbee':'f211','leanpub':'f212','sellsy':'f213','shirtsinbulk':'f214','simplybuilt':'f215','skyatlas':'f216','cart-plus':'f217','cart-arrow-down':'f218','diamond':'f219','ship':'f21a','user-secret':'f21b','motorcycle':'f21c','street-view':'f21d','heartbeat':'f21e','venus':'f221','mars':'f222','mercury':'f223','intersex,transgender':'f224','transgender-alt':'f225','venus-double':'f226','mars-double':'f227','venus-mars':'f228','mars-stroke':'f229','mars-stroke-v':'f22a','mars-stroke-h':'f22b','neuter':'f22c','genderless':'f22d','facebook-official':'f230','pinterest-p':'f231','whatsapp':'f232','server':'f233','user-plus':'f234','user-times':'f235','hotel,bed':'f236','viacoin':'f237','train':'f238','subway':'f239','medium':'f23a','yc,y-combinator':'f23b','optin-monster':'f23c','opencart':'f23d','expeditedssl':'f23e','battery-4,battery-full':'f240','battery-3,battery-three-quarters':'f241','battery-2,battery-half':'f242','battery-1,battery-quarter':'f243','battery-0,battery-empty':'f244','mouse-pointer':'f245','i-cursor':'f246','object-group':'f247','object-ungroup':'f248','sticky-note':'f249','sticky-note-o':'f24a','cc-jcb':'f24b','cc-diners-club':'f24c','clone':'f24d','balance-scale':'f24e','hourglass-o':'f250','hourglass-1,hourglass-start':'f251','hourglass-2,hourglass-half':'f252','hourglass-3,hourglass-end':'f253','hourglass':'f254','hand-grab-o,hand-rock-o':'f255','hand-stop-o,hand-paper-o':'f256','hand-scissors-o':'f257','hand-lizard-o':'f258','hand-spock-o':'f259','hand-pointer-o':'f25a','hand-peace-o':'f25b','trademark':'f25c','registered':'f25d','creative-commons':'f25e','gg':'f260','gg-circle':'f261','tripadvisor':'f262','odnoklassniki':'f263','odnoklassniki-square':'f264','get-pocket':'f265','wikipedia-w':'f266','safari':'f267','chrome':'f268','firefox':'f269','opera':'f26a','internet-explorer':'f26b','tv,television':'f26c','contao':'f26d','500px':'f26e','amazon':'f270','calendar-plus-o':'f271','calendar-minus-o':'f272','calendar-times-o':'f273','calendar-check-o':'f274','industry':'f275','map-pin':'f276','map-signs':'f277','map-o':'f278','map':'f279','commenting':'f27a','commenting-o':'f27b','houzz':'f27c','vimeo':'f27d','black-tie':'f27e','fonticons':'f280','reddit-alien':'f281','edge':'f282','credit-card-alt':'f283','codiepie':'f284','modx':'f285','fort-awesome':'f286','usb':'f287','product-hunt':'f288','mixcloud':'f289','scribd':'f28a','pause-circle':'f28b','pause-circle-o':'f28c','stop-circle':'f28d','stop-circle-o':'f28e','shopping-bag':'f290','shopping-basket':'f291','hashtag':'f292','bluetooth':'f293','bluetooth-b':'f294','percent':'f295','gitlab':'f296','wpbeginner':'f297','wpforms':'f298','envira':'f299','universal-access':'f29a','wheelchair-alt':'f29b','question-circle-o':'f29c','blind':'f29d','audio-description':'f29e','volume-control-phone':'f2a0','braille':'f2a1','assistive-listening-systems':'f2a2','asl-interpreting,american-sign-language-interpreting':'f2a3','deafness,hard-of-hearing,deaf':'f2a4','glide':'f2a5','glide-g':'f2a6','signing,sign-language':'f2a7','low-vision':'f2a8','viadeo':'f2a9','viadeo-square':'f2aa','snapchat':'f2ab','snapchat-ghost':'f2ac','snapchat-square':'f2ad','pied-piper':'f2ae','first-order':'f2b0','yoast':'f2b1','themeisle':'f2b2','google-plus-circle,google-plus-official':'f2b3','fa,font-awesome':'f2b4'}
  // Node Dataset
  const data = {
    filterStr:null,

    classes2colors: {},
    container: null,
    svg: null,
    svgNodes: null,
    svgRelationships: null,

    svgWidth: 1280,
    svgHeight: 768,

    node: null,
    nodes: null,

    links: null,
    forceNodes: null,

    relationship: null,
    relationships: null,
    relationshipOutline: null,
    relationshipOverlay: null,
    relationshipText: null,

    simulation: null,
    svgTranslate: null,
    svgScale: null,

    justLoaded: false,

    numClasses: 0,
    options: {
      arrowSize: 4,
      colors: undefined,
      highlight: [
        {
          class: 'Project',
          property: 'name',
          value: 'neo4jd3'
        }, {
          class: 'User',
          property: 'userId',
          value: 'eisman'
        }
      ],
      iconMap: iconMapData,
      imageMap: {},
      // icons: undefined,
      // images: undefined,
      // icons: undefined,
      // images: undefined,
      icons: {
//                        'Address': 'home',
        'Api': 'gear',
//                        'BirthDate': 'birthday-cake',
        'Cookie': 'paw',
//                        'CreditCard': 'credit-card',
//                        'Device': 'laptop',
        'Email': 'at',
        'Git': 'git',
        'Github': 'github',
        'Google': 'google',
//                        'icons': 'font-awesome',
        'Ip': 'map-marker',
        'Issues': 'exclamation-circle',
        'Language': 'language',
        'Options': 'sliders',
        'Password': 'lock',
        'Phone': 'phone',
        'Project': 'folder-open',
        'SecurityChallengeAnswer': 'commenting',
        'User': 'user',
        'zoomFit': 'arrows-alt',
        'zoomIn': 'search-plus',
        'zoomOut': 'search-minus',
        'Person': 'user',
        'Movie': 'fast-movie',
      },
      images: {
        'Address': 'img/twemoji/1f3e0.svg',
//                        'Api': 'img/twemoji/1f527.svg',
        'BirthDate': 'img/twemoji/1f382.svg',
        'Cookie': 'img/twemoji/1f36a.svg',
        'CreditCard': 'img/twemoji/1f4b3.svg',
        'FET': 'fet_logo_en_sm.jpg',
        'Device': 'img/twemoji/1f4bb.svg',
        'Email': 'img/twemoji/2709.svg',
        'Git': 'img/twemoji/1f5c3.svg',
        'Github': 'img/twemoji/1f5c4.svg',
        'icons': 'img/twemoji/1f38f.svg',
        'Ip': 'img/twemoji/1f4cd.svg',
        'Issues': 'img/twemoji/1f4a9.svg',
        'Language': 'img/twemoji/1f1f1-1f1f7.svg',
        'Options': 'img/twemoji/2699.svg',
        'Password': 'img/twemoji/1f511.svg',
//                        'Phone': 'img/twemoji/1f4de.svg',
        'Project': 'img/twemoji/2198.svg',
        'Project2|name|neo4jd3': 'img/twemoji/2196.svg',
//                        'SecurityChallengeAnswer': 'img/twemoji/1f4ac.svg',
        'User': 'img/twemoji/1f600.svg',
        'Person': 'img/twemoji/1f575-1f3fb.svg',
        'Movie': 'img/twemoji/25b6.svg',
//                        'zoomFit': 'img/twemoji/2194.svg',
//                        'zoomIn': 'img/twemoji/1f50d.svg',
//                        'zoomOut': 'img/twemoji/1f50e.svg'
      },
      infoPanel: true,
      minCollision: 50,
      neo4jData: undefined,
      neo4jDataUrl: undefined,
      nodeOutlineFillColor: undefined,
      onNodeDoubleClick: function(node) {
        switch(node.id) {
          case '25':
            // Google
            window.open(node.properties.url, '_blank');
            break;
          default:
            let maxNodes = 5,
                data = randomD3Data(node, maxNodes);
            updateWithD3Data(data);
            break;
        }
      },
      nodeRadius: 25,
      relationshipColor: '#a5abb6',
      zoomFit: true
    },

    nodesData: [
      {id: 1   , name: "A", labels: ["Project2"],"properties": {
          "name": "neo4jd3",
          "title": "neo4jd3.js",
          "description": "Neo4j graph visualization using D3.js.",
          "url": "https://eisman.github.io/neo4jd3"
        }},
      {id: 2   , name: "B", avatar: 'image/url#1' ,  labels: ["Password"],},
      {id: 3   , name: "C", avatar: 'image/url#1' ,  labels: ["FET"],},
      {id: 4   , name: "D", avatar: 'image/url#1' ,  labels: ["Github"],},
      {id: 5   , name: "E", avatar: 'image/url#1' ,  labels: ["Email"],},
      {id: 6   , name: "F", avatar: 'image/url#1' ,  labels: ["Ip"],},
      {id: 7   , name: "G", avatar: 'image/url#1' ,  labels: ["FET"],},
      {id: 8   , name: "H", avatar: 'image/url#1' ,  labels: ["CreditCard"],},
      {id: 9   , name: "I", avatar: 'image/url#1' ,  labels: ["BirthDate"],},
      {id: 10  , name: "J", avatar: 'image/url#1' ,  labels: ["FET"],}
    ],
    relationsData: [
      {"id": 1,"source": 1, relation: '關係1', "target": 2},
      {"id": 2,"source": 1, relation: '關係2', "target": 3},
      {"id": 3,"source": 1, relation: '關係3', "target": 6},
      {"id": 4,"source": 2, relation: '關係4', "target": 3},
      {"id": 5,"source": 2, relation: '關係5', "target": 7},
      {"id": 6,"source": 3, relation: '關係6', "target": 4},
      {"id": 7,"source": 3, relation: '關係7', "target": 8},
      {"id": 8,"source": 4, relation: '關係8', "target": 5},
      {"id": 9,"source": 4, relation: '關係9', "target": 9},
      {"id": 10,"source": 5, relation: '關係10', "target": 10}
    ]
  }
  // reactive聲明响應式數據，用于聲明引用數據類型
  const state = reactive(data)
  // 使用toRefs解构
  const {svg , container ,nodesData, relationsData , svgTranslate , svgScale , options , justLoaded , simulation ,node , nodes ,relationship , relationships ,filterStr} = toRefs(state)

  function appendGraph() {
    state.svg = state.container
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('class', 'neo4jd3-graph')
        .call(d3.zoom().scaleExtent([.01, 4]).on('zoom', function(zoomEvent) {
          let scale = zoomEvent.transform.k,
              translate = [zoomEvent.transform.x, zoomEvent.transform.y];
          if (state.svgTranslate) {
            translate[0] += state.svgTranslate[0];
            translate[1] += state.svgTranslate[1];
          }

          if (svgScale.value) {
            scale *= svgScale.value;
          }

          // state.svg.attr('transform', 'translate(' + translate[0] + ', ' + translate[1] + ') scale(' + scale + ')');
          state.svg.attr('transform', zoomEvent.transform)
        }))
        .on('dblclick.zoom', null)
        .append('g')
        .attr('width', '100%')
        .attr('height', '100%');

    state.svgRelationships = state.svg.append('g')
        .attr('class', 'relationships');

    state.svgNodes = state.svg.append('g')
        .attr('class', 'nodes');
  }

  /**
   * Filter Node 過濾節點
   */
  const filterData = () => {
    state.node.each(function(d) {
      d.show = false; // by default don't show if a filter is applied.
    })

    state.relationship.each(function(d) {
      console.log('filterData' , d)
      console.log('filterStr' ,state.filterStr)

      if(state?.filterStr && d.source.name.indexOf(state.filterStr) === -1 && d.target.name.indexOf(state.filterStr) === -1) {
        d3.select(this).attr("opacity",0);
      } else {
        d.source.show = d.target.show = true;
        d3.select(this).attr("opacity",1);
      }
    })
    state.node.attr("opacity",function(d) { return d.show ? 1 : 0 });
  }

  function zoomFit(transitionDuration) {
    console.log('state.svg.node()' , state.svg.node())
    let bounds = state.svg.node().getBBox(),
        parent = state.svg.node().parentElement.parentElement,
        fullWidth = parent.clientWidth,
        fullHeight = parent.clientHeight,
        width = bounds.width,
        height = bounds.height,
        midX = bounds.x + width / 2,
        midY = bounds.y + height / 2;

    if (width === 0 || height === 0) {
      return; // nothing to fit
    }

    state.svgScale = 0.85 / Math.max(width / fullWidth, height / fullHeight);
    state.svgTranslate = [fullWidth / 2 - svgScale * midX, fullHeight / 2 - svgScale * midY];

    state.svg
            .attr('transform', 'translate(' + svgTranslate[0] + ', ' + svgTranslate[1] + ') scale(' + svgScale + ')');
    // smoothTransform(svgTranslate, svgScale);
  }

  const initSimulation = () => {
    // 設定力模擬器
    return d3.forceSimulation()
        // .alphaDecay(0) // 收斂永不停止
        // .velocityDecay(0.2) // 設定摩擦係數
        .force("link", d3.forceLink().id((d) => d.id))
        // 設定中心點位置
        // .force("center", d3.forceCenter(250, 150))
        // .force("center", d3.forceCenter().x(550).y(150))
        // .force("center", d3.forceCenter().x(550).y(150))
        .force('center', d3.forceCenter(state.svg.node().parentElement.parentElement.clientWidth / 2, state.svg.node().parentElement.parentElement.clientHeight / 4))
        // 設定節點間電荷力
        .force("charge", d3.forceManyBody().strength(0.3))
        // .force("charge", d3.forceManyBody().strength(1))
        // 設定節點間彼此的互斥力
        // .force("collide", d3.forceCollide().strength(0.2).radius(60).iterations(3))
        .force('collide', d3.forceCollide().radius(function(d) {
          return state.options.minCollision;
        }).iterations(1))
        .on('tick', ticked)
        .on('end', () => {
          if (state.options.zoomFit && !justLoaded) {
            state.justLoaded = true
            zoomFit(2)
          }
        });
  }
  const initSimulation2 = () => {
    // 設定力模擬器
    return d3.forceSimulation()
        .force('link', d3.forceLink().id(function(d) { return d.id; }).distance(80).strength(1))
        // 設定節點間電荷力
        // .force('charge', d3.forceManyBody().strength(-15).distanceMax(300))
        .force("charge", d3.forceManyBody().strength(0.3))
        // 設定節點間彼此的互斥力
        // .force("collide", d3.forceCollide().strength(0.2).radius(30).iterations(1))
        .force('collide', d3.forceCollide().radius(function(d) {
            return state.options.minCollision;
        }).iterations(1))
        .force('x', d3.forceX(state.svgWidth/1.5))
        .force('y', d3.forceY(state.svgHeight/3))
        .on('tick', ticked)
        .on('end', () => {
          if (state.options.zoomFit && !justLoaded) {
            state.justLoaded = true
            zoomFit(2)
          }
        });
  }

  function loadNeo4jData() {
    // init data type
    state.nodes = []
    state.relationships = []
    state.options.colors = genColors()

    updateWithNeo4jData(genNeo4jData());
  }

  function updateWithNeo4jData(neo4jData) {
    // let d3Data = neo4jDataToD3Data(neo4jData);
    let d3Data = { nodes: neo4jData.nodesData , relationships: neo4jData.relationsData }

    updateWithD3Data(d3Data);
  }

  function updateWithD3Data(d3Data) {
    state.forceNodes = state.nodesData.reduce((items, nodeData) => {
      items.push(Object.assign(nodeData,{
        collapsing: 0,
        collapsed: false
      }))
      return items
    }, [])
    //處理已關聯資訊轉換
    state.relationships = state.relationsData.reduce((items, relationData) => {
      let sourceNode = state.nodesData.filter(function(n) {
            return n.id === relationData.source;
          })[0]
      let targetNode = state.nodesData.filter(function(n) {
            return n.id === relationData.target;
          })[0]
      items.push(Object.assign(relationData,{
        source: sourceNode,
        target: targetNode
      }))
      return items
    }, [])

    updateNodesAndRelationships();
  }

  function updateNodesAndRelationships() {
    console.log(state.nodes)
    state.nodes = state.forceNodes.filter(function(d) {
      return d.collapsing === 0;
    });
    state.links = state.relationships.filter(function(d) {
      return d.source.collapsing === 0 && d.target.collapsing === 0;
    });

    state.simulation
        .nodes(state.nodes)
        .force('link', d3.forceLink(state.links))
        .restart()

    updateRelationships()
    updateNodes()
  }

/**
 * Update Node Relationships
 * @param relationshipsData
 */
function updateRelationships() {

    // Array.prototype.push.apply(state.relationships, relationshipsData);

    state.relationship = state.svgRelationships.selectAll('.relationship')
        .data(state.links, function(d) { return d.id; });
    // reset
    state.relationship.exit()
        .transition()
        .duration(100)
        .remove()

    let relationshipEnter = appendRelationshipToGraph();
    state.relationship = relationshipEnter.relationship.merge(state.relationship);
    // outline
    state.relationshipOutline = state.svg.selectAll('.relationship .outline');
    state.relationshipOutline = relationshipEnter.outline.merge(state.relationshipOutline);

    // outlineOverlay
    state.relationshipOverlay = state.svg.selectAll('.relationship .overlay');
    state.relationshipOverlay = relationshipEnter.overlay.merge(state.relationshipOverlay);

    // outlineText
    state.relationshipText = state.svg.selectAll('.relationship .text');
    state.relationshipText = relationshipEnter.text.merge(state.relationshipText);
  }

  const appendRelationshipToGraph = () => {

    let relationship = appendRelationship(),
        text = appendTextToRelationship(relationship),
        outline = appendOutlineToRelationship(relationship),
        overlay = appendOverlayToRelationship(relationship);
    return {
      outline: outline,
      overlay: overlay,
      relationship: relationship,
      text: text
    }
  }

  // 新增線群組
  function appendRelationship() {
    return state.relationship.enter()
        .append('g')
        .attr('class', 'relationship')
        // .on('dblclick', function(d) {
        //   if (typeof options.onRelationshipDoubleClick === 'function') {
        //     options.onRelationshipDoubleClick(d);
        //   }
        // })
        // .on('mouseenter', function(d) {
        //   if (info) {
        //     updateInfo(d);
        //   }
        // });
  }

  function appendOutlineToRelationship(relationship) {
    return relationship.append('path')
        .attr('class', 'outline')
        .attr('fill', '#a5abb6')
        .attr('stroke', 'none');
  }

  function appendOverlayToRelationship(relationship) {
    return relationship.append('path')
        .attr('class', 'overlay')
        .style('opacity', 0);
  }

  function appendTextToRelationship(relationship) {
    return relationship.append('text')
            .attr('class', 'text')
            .attr('fill', '#000000')
            .attr('font-size', '8px')
            .attr('pointer-events', 'none')
            .attr('text-anchor', 'middle')
            .text(data => data.relation)
            // .text( data => data.type)
  }


  function updateNodes() {
    // Array.prototype.push.apply(state.nodes, n);

    state.node = state.svgNodes.selectAll('.node')
        .data(state.nodes, function(d) { return d.id; });

    state.node.exit()
        .transition()
        .duration(100)
        .remove()

    let nodeEnter = appendNodeToGraph();
    state.node = nodeEnter.merge(state.node);
  }

  function appendNodeToGraph() {
    let nodeEnter = appendNode();

    appendRingToNode(nodeEnter);
    appendOutlineToNode(nodeEnter);
    //
    // if (options.icons) {
      appendTextToNode(nodeEnter);
      appendIconToNode(nodeEnter);
    // }
    //
    // if (options.images) {
      appendImageToNode(nodeEnter);
    // }

    return nodeEnter;
  }

  const appendTextToNode = (node) => {
    return node.append('text')
        .attr('class', 'text')
        .attr('fill', '#000000')
        .attr('font-size', '10px')
        .attr('pointer-events', 'none')
        .attr('text-anchor', 'middle')
        .attr('y', '35px')
        .html(function(d) {
          return d.title
        });
  }
const appendIconToNode = (node) => {
  return node.append('text')
      .attr('class', function(d) {
        return 'text' + (icon(d) ? ' icon' : '');
      })
      .attr('fill', '#ffffff')
      .attr('font-size', function(d) {
        return icon(d) ? (state.options.nodeRadius + 'px') : '10px'
        // return '16px'
      })
      .attr('pointer-events', 'none')
      .attr('text-anchor', 'middle')
      .attr('y', function(d) {
        return icon(d) ? (parseInt(Math.round(state.options.nodeRadius * 0.32)) + 'px') : '4px'
        // return '2px'
      })
      .html(function(d) {
        let _icon = icon(d)
        return _icon ? '&#x' + _icon : d.title
      });
}

  const appendImageToNode = (node) => {
    return node.append('image')
        .attr('height', function(d) {
          return icon(d) ? '24px': '30px';
        })
        .attr('x', function(d) {
          return icon(d) ? '5px': '-15px';
        })
        .attr('xlink:href', function(d) {
          return window.location.origin + '/' + image(d)
        })
        .attr('y', function(d) {
          return icon(d) ? '5px': '-16px';
        })
        .attr('width', function(d) {
          return icon(d) ? '24px': '30px';
        });
  }

  const appendNode = () => {
    return state.node.enter()
        .append('g')
        .attr('class', (d) => {
          // console.log('appendNode', d)
          let highlight, i,
              classes = 'node',
              // label = d.name;
              label = d.labels[0];

            if (icon(d)) {
              classes += ' node-icon';
            }

            if (image(d)) {
              classes += ' node-image';
            }

            if (state.options.highlight) {
              for (i = 0; i < state.options.highlight.length; i++) {
                highlight = state.options.highlight[i];

                // if (d.labels[0] === highlight.class && d.properties[highlight.property] === highlight.value) {
                //   classes += ' node-highlighted';
                //   break;
                // }
              }
            }
          return classes;
        })
        .on('click', nodeClick)
        .on('dblclick', (event , d) => {
          stickNode(event,d);

          // if (typeof state.options.onNodeDoubleClick === 'function') {
          //   state.options.onNodeDoubleClick(d);
          // }
        })
        // .on('mouseenter', (d) => {
        //   if (info) {
        //     updateInfo(d);
        //   }
        //
        //   if (typeof options.onNodeMouseEnter === 'function') {
        //     options.onNodeMouseEnter(d);
        //   }
        // })
        // .on('mouseleave', (d) => {
        //   if (info) {
        //     clearInfo(d);
        //   }
        //
        //   if (typeof options.onNodeMouseLeave === 'function') {
        //     options.onNodeMouseLeave(d);
        //   }
        // })
        .call(d3.drag()
            .on('start', dragStarted)
            .on('drag', dragged)
            .on('end', dragEnded));
  }

  const icon = (d) => {
    let code;
    // TODO: init icon
    // if (state.options.iconMap && state.options.showIcons && state.options.icons) {
    if (state.options.iconMap && state.options.icons) {
      if (state.options.icons[d.labels[0]] && state.options.iconMap[state.options.icons[d.labels[0]]]) {
        code = state.options.iconMap[state.options.icons[d.labels[0]]];
      } else if (state.options.iconMap[d.labels[0]]) {
        code = state.options.iconMap[d.labels[0]];
      } else if (state.options.icons[d.labels[0]]) {
        code = state.options.icons[d.labels[0]];
      }
    }

    return code;
  }

  const image = (d) => {
    let i, imagesForLabel, img, imgLevel, label, labelPropertyValue, property, value

    if (state.options.images) {
      imagesForLabel = state.options.imageMap[d.labels[0]];

      if (imagesForLabel) {
        imgLevel = 0;

        for (i = 0; i < imagesForLabel.length; i++) {
          labelPropertyValue = imagesForLabel[i].split('|');

          switch (labelPropertyValue.length) {
            case 3:
              value = labelPropertyValue[2];
              /* falls through */
            case 2:
              property = labelPropertyValue[1];
              /* falls through */
            case 1:
              label = labelPropertyValue[0];
          }

          if (d.labels[0] === label &&
              (!property || d.properties[property] !== undefined) &&
              (!value || d.properties[property] === value)) {
            if (labelPropertyValue.length > imgLevel) {
              img = state.options.images[imagesForLabel[i]];
              imgLevel = labelPropertyValue.length;
            }
          }
        }
      }
    }
    return img;
  }

  const initImageMap = () => {
    let key, keys, selector;

    for (key in state.options.images) {
      if (state.options.images.hasOwnProperty(key)) {
        keys = key.split('|');

        if (!state.options.imageMap[keys[0]]) {
          state.options.imageMap[keys[0]] = [key];
        } else {
          state.options.imageMap[keys[0]].push(key);
        }
      }
    }
  }

  const class2color = (cls)  =>{
    let color = state.classes2colors[cls];

    if (!color) {
      // color = state.options.colors[Math.min(numClasses, options.colors.length - 1)];
      color = state.options.colors[state.numClasses % state.options.colors.length];
      state.classes2colors[cls] = color;
      state.numClasses++;
    }
    return color;
  }

  const class2darkenColor = (cls) => {
    return d3.rgb(class2color(cls)).darker(1);
  }

  const genNeo4jData = () => {
    return {
      nodesData: state.nodesData,
      relationsData: state.relationsData
    }
  }
  const genColors = () => {
    // d3.schemeCategory10,
    // d3.schemeCategory20,
    return [
      '#d9c8ae',
      '#ecb5c9',
      '#68bdf6', // light blue
      '#6dce9e', // green #1
      '#faafc2', // light pink
      '#f2baf6', // purple
      '#ff928c', // light red
      '#fcea7e', // light yellow
      '#ffc766', // light orange
      '#405f9e', // navy blue
      '#a5abb6', // dark gray
      '#78cecb', // green #2,
      '#b88cbb', // dark purple
      '#ced2d9', // light gray
      '#e84646', // dark red
      '#fa5f86', // dark pink
      '#ffab1a', // dark orange
      '#fcda19', // dark yellow
      '#797b80', // black
      '#c9d96f', // pistacchio
      '#47991f', // green #3
      '#70edee', // turquoise
      '#ff75ea'  // pink
    ];
  }

  const dragEnded = (dragEvent , d) => {
    console.log('dragEnded d' , d)
    if (!dragEvent.active) state.simulation.alphaTarget(0)
    d.fx = null
    d.fy = null

    if (typeof options.onNodeDragEnd === 'function') {
      options.onNodeDragEnd(d);
    }
  }

  const nodeClick = (event , d) => {
    d.fx = d.fy = null;
    if (!event.defaultPrevented) {
      let inc = d.collapsed ? -1 : 1;
      console.log('recurse1' , state.relationships)
      const recurse = (sourceNode) => {
        //check if link is from this node, and if so, collapse
        state.relationships.forEach(function(l) {
          if (l.source.id === sourceNode.id) {
            l.target.collapsing += inc;
            recurse(l.target);
          }
        });
      }
      recurse(d)
      d.collapsed = !d.collapsed;
    }

    console.log('recurse2' , state.relationships)

    updateNodesAndRelationships()
  }

  const dragged = (dragEvent, d) => {
    stickNode(dragEvent , d);
  }

  const dragStarted = (dragEvent , d ) => {
    if (!dragEvent.active) {
      state.simulation.alphaTarget(0.3).restart();
    }
    dragEvent.subject.fx = dragEvent.subject.x
    dragEvent.subject.fy = dragEvent.subject.y
    // d.fx = d.x;
    // d.fy = d.y;
    if (typeof options.onNodeDragStart === 'function') {
      options.onNodeDragStart(d);
    }
  }

  const stickNode = (dragEvent , d) => {
    d.fx = dragEvent.x;
    d.fy = dragEvent.y;
    // d.fx = dragEvent.x;
    // d.fy = dragEvent.y;
  }

  function appendRingToNode(node) {
    return node.append('circle')
        .attr('class', 'ring')
        .attr('r', state.options.nodeRadius * 1.16)
        .append('title')
        .text(d => d.name)
        // .text( d => toString(d))
  }

  function appendOutlineToNode(node) {
    return node.append('circle')
        .attr('class', 'outline')
        .attr('r', state.options.nodeRadius)
        .style('fill', (d) => {
          return state.options.nodeOutlineFillColor ? state.options.nodeOutlineFillColor : class2color(d.labels[0]);
        })
        .style('stroke', (d) => {
          return state.options.nodeOutlineFillColor ? class2darkenColor(state.options.nodeOutlineFillColor) : class2darkenColor(d.labels[0]);
        })
        .append('title')
        .text(d => d.name)
        // .text( (d) =>  toString(d))
  }

  // 綁定節點 線 文字
  const ticked = () => {
    tickNodes()
    tickRelationships()
  }

  const tickNodes = () => {
    if (state.node) {
      state.node.attr('transform', function(d) {
        return 'translate(' + d.x + ', ' + d.y + ')';
      });
    }
  }
  const tickRelationships = async () => {
    if (state.relationship) {
      state.relationship.attr('transform', function (d) {
        let angle = rotation(d.source, d.target);
        return 'translate(' + d.source.x + ', ' + d.source.y + ') rotate(' + angle + ')';
      });

      await tickRelationshipsTexts();
      await tickRelationshipsOutlines();
      await tickRelationshipsOverlays();
    }
  }

  const tickRelationshipsTexts = async () => {
    state.relationshipText.attr('transform', function(d) {
      let angle = (rotation(d.source, d.target) + 360) % 360,
          mirror = angle > 90 && angle < 270,
          center = { x: 0, y: 0 },
          n = unitaryNormalVector(d.source, d.target),
          nWeight = mirror ? 2 : -3,
          point = { x: (d.target.x - d.source.x) * 0.5 + n.x * nWeight, y: (d.target.y - d.source.y) * 0.5 + n.y * nWeight },
          rotatedPoint = rotatePoint(center, point, angle);

      return 'translate(' + rotatedPoint.x + ', ' + rotatedPoint.y + ') rotate(' + (mirror ? 180 : 0) + ')';
    });
  }

  const tickRelationshipsOutlines = async () => {
    state.relationship.each( function (relationship) {
      let rel = d3.select(this),
          outline = rel.select('.outline'),
          text = rel.select('.text'),
          bbox = text.node().getBBox(),
          padding = 3;

      outline.attr('d', function(d) {
        let center = { x: 0, y: 0 },
            angle = rotation(d.source, d.target),
            textBoundingBox = text.node().getBBox(),
            textPadding = 5,
            u = unitaryVector(d.source, d.target),
            textMargin = { x: (d.target.x - d.source.x - (textBoundingBox.width + textPadding) * u.x) * 0.5, y: (d.target.y - d.source.y - (textBoundingBox.width + textPadding) * u.y) * 0.5 },
            n = unitaryNormalVector(d.source, d.target),
            rotatedPointA1 = rotatePoint(center, { x: 0 + (state.options.nodeRadius + 1) * u.x - n.x, y: 0 + (state.options.nodeRadius + 1) * u.y - n.y }, angle),
            rotatedPointB1 = rotatePoint(center, { x: textMargin.x - n.x, y: textMargin.y - n.y }, angle),
            rotatedPointC1 = rotatePoint(center, { x: textMargin.x, y: textMargin.y }, angle),
            rotatedPointD1 = rotatePoint(center, { x: 0 + (state.options.nodeRadius + 1) * u.x, y: 0 + (state.options.nodeRadius + 1) * u.y }, angle),
            rotatedPointA2 = rotatePoint(center, { x: d.target.x - d.source.x - textMargin.x - n.x, y: d.target.y - d.source.y - textMargin.y - n.y }, angle),
            rotatedPointB2 = rotatePoint(center, { x: d.target.x - d.source.x - (state.options.nodeRadius + 1) * u.x - n.x - u.x * state.options.arrowSize, y: d.target.y - d.source.y - (state.options.nodeRadius + 1) * u.y - n.y - u.y * state.options.arrowSize }, angle),
            rotatedPointC2 = rotatePoint(center, { x: d.target.x - d.source.x - (state.options.nodeRadius + 1) * u.x - n.x + (n.x - u.x) * state.options.arrowSize, y: d.target.y - d.source.y - (state.options.nodeRadius + 1) * u.y - n.y + (n.y - u.y) * state.options.arrowSize }, angle),
            rotatedPointD2 = rotatePoint(center, { x: d.target.x - d.source.x - (state.options.nodeRadius + 1) * u.x, y: d.target.y - d.source.y - (state.options.nodeRadius + 1) * u.y }, angle),
            rotatedPointE2 = rotatePoint(center, { x: d.target.x - d.source.x - (state.options.nodeRadius + 1) * u.x + (- n.x - u.x) * state.options.arrowSize, y: d.target.y - d.source.y - (state.options.nodeRadius + 1) * u.y + (- n.y - u.y) * state.options.arrowSize }, angle),
            rotatedPointF2 = rotatePoint(center, { x: d.target.x - d.source.x - (state.options.nodeRadius + 1) * u.x - u.x * state.options.arrowSize, y: d.target.y - d.source.y - (state.options.nodeRadius + 1) * u.y - u.y * state.options.arrowSize }, angle),
            rotatedPointG2 = rotatePoint(center, { x: d.target.x - d.source.x - textMargin.x, y: d.target.y - d.source.y - textMargin.y }, angle);

        return 'M ' + rotatedPointA1.x + ' ' + rotatedPointA1.y +
            ' L ' + rotatedPointB1.x + ' ' + rotatedPointB1.y +
            ' L ' + rotatedPointC1.x + ' ' + rotatedPointC1.y +
            ' L ' + rotatedPointD1.x + ' ' + rotatedPointD1.y +
            ' Z M ' + rotatedPointA2.x + ' ' + rotatedPointA2.y +
            ' L ' + rotatedPointB2.x + ' ' + rotatedPointB2.y +
            ' L ' + rotatedPointC2.x + ' ' + rotatedPointC2.y +
            ' L ' + rotatedPointD2.x + ' ' + rotatedPointD2.y +
            ' L ' + rotatedPointE2.x + ' ' + rotatedPointE2.y +
            ' L ' + rotatedPointF2.x + ' ' + rotatedPointF2.y +
            ' L ' + rotatedPointG2.x + ' ' + rotatedPointG2.y +
            ' Z';
      });
    });
  }
  const tickRelationshipsOverlays = async () => {
    state.relationshipOverlay.attr('d', function(d) {
      let center = { x: 0, y: 0 },
          angle = rotation(d.source, d.target),
          n1 = unitaryNormalVector(d.source, d.target),
          n = unitaryNormalVector(d.source, d.target, 50),
          rotatedPointA = rotatePoint(center, { x: 0 - n.x, y: 0 - n.y }, angle),
          rotatedPointB = rotatePoint(center, { x: d.target.x - d.source.x - n.x, y: d.target.y - d.source.y - n.y }, angle),
          rotatedPointC = rotatePoint(center, { x: d.target.x - d.source.x + n.x - n1.x, y: d.target.y - d.source.y + n.y - n1.y }, angle),
          rotatedPointD = rotatePoint(center, { x: 0 + n.x - n1.x, y: 0 + n.y - n1.y }, angle);

      return 'M ' + rotatedPointA.x + ' ' + rotatedPointA.y +
          ' L ' + rotatedPointB.x + ' ' + rotatedPointB.y +
          ' L ' + rotatedPointC.x + ' ' + rotatedPointC.y +
          ' L ' + rotatedPointD.x + ' ' + rotatedPointD.y +
          ' Z';
    });
  }

  const unitaryNormalVector = (source, target, newLength) => {
    let center = { x: 0, y: 0 },
        vector = unitaryVector(source, target, newLength);

    return rotatePoint(center, vector, 90);
  }

  const unitaryVector = (source, target, newLength) => {
    let length = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2)) / Math.sqrt(newLength || 1);

    return {
      x: (target.x - source.x) / length,
      y: (target.y - source.y) / length,
    };
  }

  const rotatePoint = (c, p, angle) =>{
    return rotate(c.x, c.y, p.x, p.y, angle);
  }

  const rotate = (cx, cy, x, y, angle) => {
    let radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;

    return { x: nx, y: ny };
  }

  const rotation = (source, target) => {
    return Math.atan2(target.y - source.y, target.x - source.x) * 180 / Math.PI;
  }

  /**
   * 用戶查询
   **/
  async function initLoadNeo4j() {
    state.loading = true
    // graphMovieByTitle('The Matrix', {status: 'The Matrix'}).then(response => {
    //   const {nodes, links} = response
    //   state.nodesData = nodes
    //   state.relationsData = links
    //   state.loading = false
    // })
    const {nodes, links} = await graphMovieByTitle('The Matrix Revolutions', {status: 'The Matrix'})
    state.nodesData = nodes
    state.relationsData = links
    state.loading = false

  }

  async function forceLink2(){
    // js
    // 設定一個顏色比例尺
    // let colorScale = d3.scaleOrdinal()
    //     .domain(d3.range(nodesData.value.length))
    //     .range(d3.schemeCategory10)

    // 取得基礎位置
    state.container = d3.select('.container-border')
    // 取得畫圖範圍
    appendGraph()
    // 定義力導向圖
    state.simulation = initSimulation2();

    // 初始化資料
    initImageMap()
    loadNeo4jData()

    //////////////// 舊方法///////////
    // const g = state.svg.append('g')
    // // 生成節點 Group
    // const dots = g.selectAll('.circleText')
    //     .data(nodesData.value)
    //     .enter()
    //     .append('g')
    // // 生成節點
    // dots.append('circle')
    //     .attr('r', 25)
    //     .attr('fill', (d, i) => {
    //       return colorScale(i)
    //     })
    //     .style('opacity', 0.4)
    // // 生成節點文字
    // dots.append("text")
    //     .attr('x', -15)
    //     .attr('y', -15)
    //     .attr('dy', -10)
    //     .text(d => d.name)
    //
    // // 生成線群組
    // const links = g.append('g')
    //       .selectAll("line")
    //       .data(relations.value)
    //       .join("line")
    //       .style('opacity', 0.4) //不透明度
    //       .attr('stroke', (d, i) => { //顏色
    //         return colorScale(i)
    //       })
    //       .attr('stroke-width', 2.5) //粗細
    //
    // // 線上的文字
    // const linksText = g.append('g')
    //       .selectAll('text')
    //       .data(relations.value)
    //       .enter()
    //       .append('text')
    //       .text(data => data.relation)
    //       .attr('x', -15)
    //       .attr('y', -15)
    //       .attr('dy', -10)

  }



  onBeforeUnmount(() => {
    beforeDestroy()
  })

  onActivated(() => {
    activated()
  })

  onDeactivated(() => {
    deactivated()
  })

  onMounted(() => {

    mounted()
    nextTick(async () => {
      await initLoadNeo4j()
      await forceLink2()
    })
  })

</script>


<style lang="scss" scoped>
::v-deep(.node) {
    .ring {
      fill: none;
      -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=0)';
      filter: alpha(opacity=0);
      opacity: 0;
      stroke: #6ac6ff;
      stroke-width: 8px;

    }
    .text.icon {
      font-family: FontAwesome;
    }
  }
</style>
