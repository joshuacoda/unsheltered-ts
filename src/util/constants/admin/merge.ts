import {
  na,
  coc,
  esg,
  rhsap,
  hopwa,
  vash,
  path,
  rhy,
  vaCRS,
  vaCCSHP,
  vaSSVF,
  pfs,
  pih,
  vaGDP,
  efsp,
  hcdCESH,
  bcshHEAP,
  hdap,
  county,
  local
} from "./funding/funding-category";

export default class Merge {
  static byKey(array1: any[], array2: any[], key: string) {
    array1.forEach(function(e) {
      const i = array2.filter(a => a[key] === e[key]).map(a => a);
      const organizationID = array1.map(a => a.OrganizationID);

      e.subData = i;

      const obj = Object.keys(e.subData);

      if (obj.length > 0) {
        let total = 0;
        const today = new Date();

        for (let i = 0; i < obj.length; i++) {
          const amount = e.subData[i].Amount;
          const startDate = new Date(e.subData[i].StartDate);
          const funder = e.subData[i].Funder;

          const federal = [
            ...coc,
            ...esg,
            ...rhsap,
            ...hopwa,
            ...vash,
            ...path,
            ...rhy,
            ...vaCRS,
            ...vaCCSHP,
            ...vaSSVF,
            ...pfs,
            ...pih,
            ...vaGDP,
            ...efsp
          ];
          const state = [...hcdCESH, ...bcshHEAP, ...hdap];

          // Amount
          if (startDate < today) {
            total += Number(e.subData[i].Amount);
          }

          // Funding Category
          if (federal.includes(funder)) {
            e.subData[i].FunderCategory = "Federal";
          }
          if (state.includes(funder)) {
            e.subData[i].FunderCategory = "State";
          }
          if (county.includes(funder)) {
            e.subData[i].FunderCategory = "County";
          }
          if (local.includes(funder)) {
            e.subData[i].FunderCategory = "Local";
          }
          if (na.includes(funder) || isNaN(funder)) {
            e.subData[i].FunderCategory = "NA: Not applicable";
          }

          e.subData[i].OrganizationID = organizationID.toString();
        }
        e.AmountTotal = total;
        return;
      } else {
        e.AmountTotal = 0;

        return;
      }
    });
    return array1;
  }
}
