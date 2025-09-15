import { Badge } from '@/components/ui/badge';

export const StageBadge = ({ stage }: { stage: string }) => {
    const getStageColor = () => {
        switch (stage.toLowerCase()) {
            case 'ready':
                return 'bg-green-500 hover:bg-green-600';
            case 'live & operating':
                return 'bg-green-600 hover:bg-green-700';
            case 'launch phase':
                return 'bg-emerald-500 hover:bg-emerald-600';
            case 'post-launch phase':
                return 'bg-teal-500 hover:bg-teal-600';
            case 'development phase':
                return 'bg-blue-500 hover:bg-blue-600';
            case 'testing phase':
                return 'bg-sky-500 hover:bg-sky-600';
            case 'design phase':
                return 'bg-indigo-500 hover:bg-indigo-600';
             case 'validation phase':
                return 'bg-yellow-500 hover:bg-yellow-600 text-black';
            case 'planning phase':
                return 'bg-orange-500 hover:bg-orange-600';
            case 'idea phase':
                return 'bg-rose-500 hover:bg-rose-600';
            case 'research phase':
                return 'bg-purple-500 hover:bg-purple-600';
            default:
                return 'bg-gray-500 hover:bg-gray-600';
        }
    }
    return (
        <Badge variant="default" className={`absolute top-2 right-2 border-none text-white ${getStageColor()}`}>
            {stage}
        </Badge>
    )
}
