import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wfmReverse',
  pure: false
})
export class ReversePipe {
  transform(value) {
    return value.slice().reverse();
  }
}
