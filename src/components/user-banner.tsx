import { useState, useEffect } from 'react'; 
import { Button } from "./ui/button";
import { CardContent, Card } from './ui/card';

export const UserBanner = () => {
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem("bannerDismissed");
        if (dismissed) {
            setDismissed(true);
        }
    }, []);

    const handleDismissed = () => {
        localStorage.setItem("bannerDismissed", "true");
        setDismissed(true);
    }

    if (dismissed) return null;

    return (
        <>
            <Card
                className='bottom-full'
            >
                <CardContent>We use cookies to keep you securely logged in and improve your experience. By using this site, you agree to our cookie policy.</CardContent>
                <div className="mt-4 flex justify-end">
                    <Button
                        className="mr-5 text-sm text-muted-foreground"
                        onClick={handleDismissed}
                    >
                        OK
                    </Button>
                </div>
            </Card>

        </>
    )
}