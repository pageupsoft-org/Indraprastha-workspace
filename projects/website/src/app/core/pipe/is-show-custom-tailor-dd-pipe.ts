import { Pipe, PipeTransform } from '@angular/core';
import { IStockWithIds } from '../../pages/product-detail/product-detail.model';
import { EStockSize } from '@shared';

@Pipe({
  name: 'isShowCustomTailorDD',
})
export class IsShowCustomTailorDDPipe implements PipeTransform {
  transform(stockId: number | null, stockSizeArrayWithIds: IStockWithIds[]): boolean {
    for (let i = 0; i < stockSizeArrayWithIds.length; i++) {
      const selectedStk = stockSizeArrayWithIds.find((stk) => stk.stockId == stockId);
      if (selectedStk) {
        if (selectedStk.key == EStockSize.CustomSize) {
          return true;
        }
      }
    }

    return false;
  }
}
