
import { initialAssets } from '@/lib/assets';
import AssetRentalsClientPage from './client-page';

export default function AssetRentalsPage() {
    const assets = initialAssets;
    return <AssetRentalsClientPage initialAssets={assets} />;
}
