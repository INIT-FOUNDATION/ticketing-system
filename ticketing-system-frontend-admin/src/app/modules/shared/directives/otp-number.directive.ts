import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appOtpNumber]'
})
export class OtpNumberDirective {
  private prevVal: any;
  constructor(private el: ElementRef) {}

  // @HostListener('keydown', ['$event']) onKeyDown(event) {
  //   const e = event as KeyboardEvent;
  //   const initalValue = this.el.nativeElement.value;

  //   console.log(e.key, `@${initalValue}#`, '$$$$$12$', e.keyCode);
  //   if ((initalValue === '' && e.keyCode === 96) || (initalValue === '' && e.keyCode === 229)) {
  //     console.log('IN 1st if')
  //     this.el.nativeElement.value = '';
  //     e.preventDefault();
  //     return false;
  //   }
  //   console.log('testVa', (/^((?!(0))[0-9]{10})$/.test(initalValue)));
  //   if ((/^((?!(0))[0-9]{10})$/.test(initalValue)) && e.keyCode !== 8 && e.keyCode !== 46) {
  //     e.preventDefault();
  //     return;
  //   } else {

  //   }
  // }



  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this.el.nativeElement.value;
    const c = initalValue.replace(/^((?!(0))[0-9]{0,6})$/g, '');
    this.el.nativeElement.value = initalValue.substr(0, 6);
    if (c.length > 1 && initalValue.length > 6) {
      this.el.nativeElement.value = this.prevVal;
    }
    if (!(/^((?!(0))[0-9]{0,6})$/.test(initalValue))) {
      if (c.length > 1 && /^(?:0|00)\d+$/.test(c)) {
        this.el.nativeElement.value = initalValue.substr(1, c.length);
        this.el.nativeElement.type = 'text';
        this.el.nativeElement.setSelectionRange(0, 0);
        this.el.nativeElement.type = 'number';
        // setSelectionRange
      } else if ((initalValue).length === 1) {
        this.el.nativeElement.value = '';
      }
      event.stopPropagation();
      return false;
    } else {
      this.prevVal = this.el.nativeElement.value;
    }

  }
}


