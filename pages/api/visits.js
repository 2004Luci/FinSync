import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./', 'counter.json'); // Path to the counter file

export default function handler(req, res) {
    // Read the current visit count from the counter file
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (req.method === 'GET') {
        // If the request is GET, return the visit count
        res.status(200).json({ visits: data.visits });
    } else if (req.method === 'POST') {
        // If the request is POST, increment the visit count
        data.visits += 1;
        fs.writeFileSync(filePath, JSON.stringify(data)); // Save the updated count
        res.status(200).json({ visits: data.visits });
    }
}
