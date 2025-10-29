import { Plan } from '../types';

export const plans: Plan[] = [
    {
        id: 'finding-peace',
        title: 'Finding Peace',
        duration: '7-Day Plan',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop',
        description: 'Discover the unshakable peace that comes from trusting God, even in the midst of life\'s storms. This 7-day plan will guide you through scriptures that anchor your heart in His tranquility.',
        content: [
            {
                day: 1,
                title: 'The Source of Peace',
                scripture: 'John 14:27',
                body: 'Jesus offers a peace that the world cannot give. It\'s not the absence of trouble, but the presence of God. Today, reflect on how this divine peace differs from worldly comfort and how you can actively receive it.',
                prayer: 'Lord, thank you for the peace you offer. Help me to seek Your peace above all else and to rest in Your presence, knowing you are in control.'
            },
            {
                day: 2,
                title: 'Peace in Anxiety',
                scripture: 'Philippians 4:6-7',
                body: 'Anxiety is a common struggle, but the Bible gives us a clear antidote: prayer and gratitude. When we present our requests to God, His peace guards our hearts and minds. Practice this today by turning a worry into a prayer.',
                prayer: 'Father, I cast my anxieties on you. Replace my worry with Your wonderful peace that surpasses all understanding. Guard my heart and mind in Christ Jesus.'
            },
            // Add more days...
        ]
    },
    {
        id: 'understanding-grace',
        title: 'Understanding Grace',
        duration: '5-Day Plan',
        image: 'https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=800&auto=format&fit=crop',
        description: 'Grace is one of the most profound concepts in Christianity. This 5-day journey will deepen your understanding of God\'s unmerited favor and how it transforms every aspect of our lives.',
        content: [
            {
                day: 1,
                title: 'Grace Defined',
                scripture: 'Ephesians 2:8-9',
                body: 'We are saved by grace through faith, not by our own works. It is a free gift from God. Spend today meditating on the freedom that comes from knowing your salvation is not based on your performance, but on His goodness.',
                prayer: 'God, I am so grateful for the gift of grace. Help me to stop striving in my own strength and to fully accept the beautiful gift you have given me through Jesus.'
            },
            // Add more days...
        ]
    },
    {
        id: 'courage-in-crisis',
        title: 'Courage in Crisis',
        duration: '10-Day Plan',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
        description: 'Life is filled with challenges that can test our faith. This 10-day plan explores biblical stories of courage to inspire you to stand firm and trust God in your own times of crisis.',
        content: [
             {
                day: 1,
                title: 'Be Strong and Courageous',
                scripture: 'Joshua 1:9',
                body: 'God commanded Joshua to be strong and courageous as he led Israel into the promised land. This same command and promise of God\'s presence applies to us today. Whatever giant you are facing, know that God is with you.',
                prayer: 'Lord, give me the strength and courage of Joshua. Remind me that I do not need to be afraid because you are with me wherever I go. Help me to step out in faith.'
            },
            // Add more days...
        ]
    }
];
