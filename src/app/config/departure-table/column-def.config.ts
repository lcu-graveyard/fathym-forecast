export class ColumnDefinition {
  public ColType: string;
  public IconConfigFunc?: Function;
  public Pipe?: string;
  public Title: string;
  public ShowIcon: boolean;
  public ShowValue: boolean;
  public Sortable?: boolean;
  public OverrideHiddenValueWhen?: string; 
  private value: string;

/**
 * Constructor for Grid column definitions
 * @param ColType Column data type
 * @param Title Column title
 * @param Value Function that passes in the column object and then returns the value, based of def
 * @param ShowValue Boolean for toggling icons
 * @param ShowIcon Boolean for toggling icons
 * @param Sortable Allow column to be sorted
 * @param Pipe String value of pipe to use
 * @param IconConfigFunc Callback function for setting icons
 */

  constructor(colType: string,
              title: string,
              showValue: boolean,
              showIcon: boolean,
              sortable?: boolean,
              pipe?: string,
              iconConfigFunc?: Function,
              overrideHiddenValueWhen?: string) {

    this.ColType = colType;
    this.Title = title;
    this.ShowValue = showValue;
    this.ShowIcon = showIcon;
    this.Sortable = sortable;
    this.Pipe = pipe;
    this.IconConfigFunc = iconConfigFunc;
    this.OverrideHiddenValueWhen = overrideHiddenValueWhen;
    //  this.OverrideHiddenValue = this.overrideHiddenValue(overrideHiddenValue);
  }

  /**
   * Set values and toggle icons or data values on / off
   * @param colObj Each item coming from the grid rows
   */
  public SetIcon<T>(colObj: T): void {

    if (this.ShowIcon && this.IconConfigFunc) {
     return this.IconConfigFunc(colObj, this.ColType);
    }
  }

  public ValueChange<T>(colObj: T): void {

    this.value = colObj[this.ColType];

    // if (!this.ShowValue) {
    //   this.ShowValue = String(this.value).toUpperCase() === this.OverrideHiddenValue.toUpperCase() ? true : false;
    // }
  }

  // private overrideHiddenValue(val: string): string {
  //   this.ShowValue = this.value === val ? true : false;
  //   return '';
  // }
}