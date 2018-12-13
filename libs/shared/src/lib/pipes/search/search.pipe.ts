import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(arr: any[], search?: string): any {
    if (!arr || !arr.length) return arr;
    if (!search) return arr;
    const lowerCasedSearch = search.toString().toLowerCase();
    return arr.filter(item =>
      JSON.stringify(item)
        .toLowerCase()
        .includes(lowerCasedSearch)
    );
  }
}
