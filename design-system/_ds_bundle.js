/* @ds-bundle: {"namespace":"BarbershopDesignSystem","components":[{"name":"AppointmentCard","sourcePath":"components/general/AppointmentCard/AppointmentCard.jsx"},{"name":"Button","sourcePath":"components/general/Button/Button.jsx"},{"name":"CreditChip","sourcePath":"components/general/CreditChip/CreditChip.jsx"},{"name":"Input","sourcePath":"components/general/Input/Input.jsx"},{"name":"ScheduleTable","sourcePath":"components/general/ScheduleTable/ScheduleTable.jsx"},{"name":"SlotPicker","sourcePath":"components/general/SlotPicker/SlotPicker.jsx"},{"name":"StatusBadge","sourcePath":"components/general/StatusBadge/StatusBadge.jsx"}],"sourceHashes":{"components/general/AppointmentCard/AppointmentCard.jsx":"365a6d846aab","components/general/AppointmentCard/AppointmentCard.d.ts":"a580ab6d5e73","components/general/AppointmentCard/AppointmentCard.prompt.md":"b4257879cc83","components/general/Button/Button.jsx":"5e8a55518a3b","components/general/Button/Button.d.ts":"9de8987204b2","components/general/Button/Button.prompt.md":"2a0c942b68e4","components/general/CreditChip/CreditChip.jsx":"9a93aaeccc26","components/general/CreditChip/CreditChip.d.ts":"e2f5b5e663b9","components/general/CreditChip/CreditChip.prompt.md":"165df7daf6cc","components/general/Input/Input.jsx":"a36ab457892c","components/general/Input/Input.d.ts":"55d85e757584","components/general/Input/Input.prompt.md":"29a4f5f84ec2","components/general/ScheduleTable/ScheduleTable.jsx":"41c2d31f2897","components/general/ScheduleTable/ScheduleTable.d.ts":"d35aea5664dc","components/general/ScheduleTable/ScheduleTable.prompt.md":"f7d1000afcd2","components/general/SlotPicker/SlotPicker.jsx":"05c33e2f1480","components/general/SlotPicker/SlotPicker.d.ts":"0ba65f12f389","components/general/SlotPicker/SlotPicker.prompt.md":"2b428d25d9aa","components/general/StatusBadge/StatusBadge.jsx":"993c1a807609","components/general/StatusBadge/StatusBadge.d.ts":"269ef65af168","components/general/StatusBadge/StatusBadge.prompt.md":"22b1e817bdb6"},"inlinedExternals":[],"builtBy":"cc-design-sync"} */
"use strict";
var BarbershopDesignSystem = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // <define:import.meta.env>
  var init_define_import_meta_env = __esm({
    "<define:import.meta.env>"() {
    }
  });

  // shim:react-shim
  var require_react_shim = __commonJS({
    "shim:react-shim"(exports, module) {
      init_define_import_meta_env();
      var R = window.React;
      function np(p, k) {
        var o = {};
        for (var x in p) if (x !== "children") o[x] = p[x];
        if (k !== void 0) o.key = k;
        return o;
      }
      function jsx8(t, p, k) {
        var c = p && p.children;
        return c === void 0 ? R.createElement(t, np(p, k)) : R.createElement(t, np(p, k), c);
      }
      function jsxs6(t, p, k) {
        return R.createElement.apply(R, [t, np(p, k)].concat(p.children));
      }
      module.exports = R;
      module.exports.jsx = jsx8;
      module.exports.jsxs = jsxs6;
      module.exports.jsxDEV = function(t, p, k, s) {
        return (s ? jsxs6 : jsx8)(t, p, k);
      };
      module.exports.Fragment = R.Fragment;
    }
  });

  // dist/index.js
  var index_exports = {};
  __export(index_exports, {
    AppointmentCard: () => AppointmentCard,
    Button: () => Button,
    CreditChip: () => CreditChip,
    Input: () => Input,
    ScheduleTable: () => ScheduleTable,
    SlotPicker: () => SlotPicker,
    StatusBadge: () => StatusBadge
  });
  init_define_import_meta_env();
  var React = __toESM(require_react_shim(), 1);
  var import_jsx_runtime = __toESM(require_react_shim(), 1);
  var React2 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime2 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime3 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime4 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime5 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime6 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime7 = __toESM(require_react_shim(), 1);
  var Button = React.forwardRef(
    ({ variant = "primary", className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "button",
      {
        ref,
        className: ["bds-btn", `bds-btn-${variant}`, className].filter(Boolean).join(" "),
        ...props
      }
    )
  );
  Button.displayName = "Button";
  var Input = React2.forwardRef(
    ({ label, hint, id, className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "bds-field", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { htmlFor: id, children: label }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("input", { ref, id, className: ["bds-input", className].filter(Boolean).join(" "), ...props }),
      hint ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "bds-field-hint", children: hint }) : null
    ] })
  );
  Input.displayName = "Input";
  var STATUS_LABEL = {
    booked: "Booked",
    completed: "Completed",
    no_show: "No-show",
    late_released: "Late-released",
    cancelled: "Cancelled",
    waitlisted: "Waitlisted"
  };
  var STATUS_CLASS = {
    booked: "bds-pill-booked",
    completed: "bds-pill-completed",
    no_show: "bds-pill-no-show",
    late_released: "bds-pill-late-released",
    cancelled: "bds-pill-cancelled",
    waitlisted: "bds-pill-waitlisted"
  };
  function StatusBadge({ status, label, className }) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: ["bds-pill", STATUS_CLASS[status], className].filter(Boolean).join(" "), children: label ?? STATUS_LABEL[status] });
  }
  function AppointmentCard({
    service,
    provider,
    location,
    startLabel,
    status,
    amountDue,
    currency = "$",
    className
  }) {
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: ["bds-appt-card", className].filter(Boolean).join(" "), children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "bds-appt-top", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "bds-appt-service", children: service }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "bds-appt-meta", children: [
            "with ",
            provider,
            location ? ` \xB7 ${location}` : ""
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StatusBadge, { status })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "bds-appt-time", children: startLabel }),
      amountDue != null ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "bds-appt-due", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: "Amount due at visit" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("b", { children: [
          currency,
          amountDue.toFixed(2)
        ] })
      ] }) : null
    ] });
  }
  function ScheduleTable({ rows, onComplete, onMarkLate, onMarkNoShow, className }) {
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: ["bds-table-wrap", className].filter(Boolean).join(" "), children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("table", { className: "bds-roster", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("tr", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("th", { children: "Time" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("th", { children: "Client" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("th", { children: "Service" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("th", { children: "Provider" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("th", { children: "Status" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("th", { children: "Actions" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("tbody", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("tr", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("td", { className: "bds-num", children: row.time }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("td", { children: row.client }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("td", { children: row.service }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("td", { children: row.provider }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StatusBadge, { status: row.status }) }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("td", { children: row.status === "booked" ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "bds-roster-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "button",
            {
              type: "button",
              className: "bds-icon-btn bds-icon-btn-complete",
              onClick: () => onComplete?.(row.id),
              children: "Complete"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "button",
            {
              type: "button",
              className: "bds-icon-btn bds-icon-btn-late",
              onClick: () => onMarkLate?.(row.id),
              children: "Late"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "button",
            {
              type: "button",
              className: "bds-icon-btn bds-icon-btn-noshow",
              onClick: () => onMarkNoShow?.(row.id),
              children: "No-show"
            }
          )
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "bds-field-hint", children: "\u2014" }) })
      ] }, row.id)) })
    ] }) });
  }
  function CreditChip({ amount, currency = "$", label = "credit available", className }) {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: ["bds-credit-chip", className].filter(Boolean).join(" "), children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "bds-credit-amt", children: [
        currency,
        amount.toFixed(2)
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "bds-credit-label", children: label })
    ] });
  }
  function SlotPicker({
    dates,
    selectedDateId,
    onSelectDate,
    slots,
    mode = "single",
    selectedSlotIds,
    onToggleSlot,
    className
  }) {
    const maxChoices = mode === "ranked" ? 2 : 1;
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: ["bds-slotpicker", className].filter(Boolean).join(" "), children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "bds-slotpicker-dates", role: "radiogroup", "aria-label": "Choose a date", children: dates.map((d) => {
        const selected = d.id === selectedDateId;
        return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
          "button",
          {
            type: "button",
            role: "radio",
            "aria-checked": selected,
            className: ["bds-date-chip", selected ? "bds-date-chip-selected" : ""].filter(Boolean).join(" "),
            onClick: () => onSelectDate(d.id),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "bds-date-weekday", children: d.weekday }),
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "bds-date-day", children: d.day }),
              d.isToday ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "bds-date-today-dot", "aria-hidden": "true" }) : null
            ]
          },
          d.id
        );
      }) }),
      mode === "ranked" ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "bds-slotpicker-hint", children: "Pick a 1st choice, then a 2nd \u2014 if your 1st is taken we\u2019ll book the 2nd and waitlist you for the 1st." }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "bds-slotpicker-grid", role: "group", "aria-label": "Available times", children: slots.map((slot) => {
        const rank = selectedSlotIds.indexOf(slot.id);
        const isSelected = rank !== -1;
        const atMax = !isSelected && selectedSlotIds.length >= maxChoices;
        const isDisabled = !slot.available || atMax;
        return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
          "button",
          {
            type: "button",
            disabled: isDisabled,
            "aria-pressed": isSelected,
            className: [
              "bds-slot",
              rank === 0 ? "bds-slot-first" : "",
              rank === 1 ? "bds-slot-second" : "",
              !slot.available ? "bds-slot-unavailable" : "",
              atMax ? "bds-slot-maxed" : ""
            ].filter(Boolean).join(" "),
            onClick: () => onToggleSlot(slot.id),
            children: [
              slot.label,
              mode === "ranked" && isSelected ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "bds-slot-rank", children: rank === 0 ? "1st choice" : "2nd choice" }) : null
            ]
          },
          slot.id
        );
      }) })
    ] });
  }
  return __toCommonJS(index_exports);
})();
window.BarbershopDesignSystem=BarbershopDesignSystem.__dsMainNs?Object.assign({},BarbershopDesignSystem,BarbershopDesignSystem.__dsMainNs,{__dsMainNs:undefined}):BarbershopDesignSystem;
