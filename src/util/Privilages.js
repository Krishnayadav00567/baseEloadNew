import _ from "lodash";
import { encryptAuth } from "../components/ajax/elements/util/Utils";
import { ENCYPT_KEY } from "./Constants";

export const PRIVILIAGES = {
  ROLES: {
    view: 1200,
    create: 1201,
    edit: 1202,
    delete: 1203,
    VIEW_AUDIT :1204
  },
  ELOAD_USERS: {
    view: 1100,
    create: 1101,
    edit: 1102,
    delete: 1103,
    RESET_PASSWORD: 1106,
    CHANGE_USER_STATUS: 1105,
    EDIT_IS_OTP: 1107,
    EDIT_MDN : 1109
  },
  MAT_CODE: {
    view: 61900,
    create: 61901,
    edit: 61902,
  },
}
export const MENU_DETAILS = [
  {
    id: 0,
    label: "Home",
    linkTo: `/${encryptAuth("home", ENCYPT_KEY)}`,
    // icon: "fa fa-area-chart",
    icon: "Dashboard.svg",
    privilages: []
  },
  {
    id: 1,
    label: "User Management",
    // icon: "fa fa-user",
    icon: "User Management.svg",
    submenus: [
      {
        id: 12,
        label: "Roles",
        linkTo: `/${encryptAuth("Roles", ENCYPT_KEY)}`,
        icon: "fa fa-users",
        privilages: [PRIVILIAGES.ROLES.view]
      },
      {
        id: 11,
        label: "Users",
        linkTo: `/${encryptAuth("eloadUsers", ENCYPT_KEY)}`,
        icon: "fa fa-autoprefixer",
        privilages: [PRIVILIAGES.ELOAD_USERS.view]
      },
      
    ]
  },
  {
    id: 2,
    label: "Test",
    // linkTo: `/${encryptAuth("test", ENCYPT_KEY)}`,
    // icon: "fa fa-area-chart",
    icon: "Dashboard.svg",
    submenus: [
      {
        id: 13,
        label: "MAT Code",
        linkTo: `/${encryptAuth("matCodeMApping", ENCYPT_KEY)}`,
        icon: "fa fa-autoprefixer",
        privilages: [PRIVILIAGES.MAT_CODE.view]
      },]
  },
  
];
