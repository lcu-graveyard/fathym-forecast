
export class WCDatasourceTypesModel {
  public FcstCfg: string;
  public Host: string;
  public Name: string;
  public URLPrefix: string;
  public VarNames: string;

  /**
   * Datasource types for search results
   *
   * @param FcstCfg configuration type
   *
   * @param Host url domain
   *
   * @param Name datasoure type
   *
   * @param URLPrefix type of route to search
   *
   * @param VarNames properties to return
   *
   */

  // constructor(fcstCfg: string, host: string, name: string, urlPrefix: string, varNames: string) {
  constructor(obj: object) {
    console.log('name: ', Object.getOwnPropertyNames(WCDatasourceTypesModel));

Object.keys(obj).forEach((key) => {
 // console.log(key + ': ' + obj[key]);

  Object.keys(this).forEach(prop => {
    console.log('prop', prop);
    if (key.toUpperCase() === prop.toUpperCase()) {
      prop = key;
    }

  });
});
    // this.FcstCfg = fcstCfg;
    // this.Host = host;
    // this.Name = name;
    // this.URLPrefix = urlPrefix;
    // this.VarNames = varNames;
  }
}


