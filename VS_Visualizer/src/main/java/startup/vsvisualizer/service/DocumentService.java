package startup.vsvisualizer.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import startup.vsvisualizer.dao.DocumentDao;
import startup.vsvisualizer.entity.Document;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

@Service
public class DocumentService {

    @Autowired
    private DocumentDao documentDao;

    private final String[] sampleTitles = {
        "The Great Adventure", "Mystery of the Night", "Journey to the Stars",
        "Secrets of the Ocean", "The Last Kingdom", "Whispers in the Wind",
        "Code of Honor", "The Hidden Path", "Echoes of Tomorrow", "Beyond the Horizon",
        "The Silent Watcher", "Legends Never Die"
    };

    private final String[] sampleAuthors = {
        "John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis",
        "David Wilson", "Lisa Anderson", "Robert Taylor", "Jennifer Martinez"
    };

    private final String[] debugTitles = {
        "The Lost City", "Ocean Depths", "Mountain Peak", "Desert Storm",
        "Forest Shadows", "Arctic Chill", "Tropical Paradise", "Northern Lights",
        "Crystal Cave", "Golden Sunrise", "Storm Rider", "Moonlit Path"
    };

    private final String[] debugAuthors = {
        "Alex Rivera", "Maria Chen", "James Wright", "Emma Thompson",
        "Daniel Kim", "Sophie Brown", "Lucas Garcia", "Olivia Davis"
    };

    public List<Document> getDocuments() {
        return generateRandomDocuments(6);
    }

    public List<Document> getRaceData(int count) {
        int validCount = Math.max(1, Math.min(1000, count));
        List<Document> docs = generateRandomDocuments(validCount);
        return docs;
    }

    public List<Document> getDebugData() {
        List<Document> docs = new ArrayList<>();
        Random random = new Random();
        
        for (int i = 0; i < 6; i++) {
            String title = debugTitles[random.nextInt(debugTitles.length)] + " " + (i + 1);
            String author = debugAuthors[random.nextInt(debugAuthors.length)];
            int score = random.nextInt(100) + 1;
            docs.add(new Document(title, author, score));
        }
        
        return docs;
    }

    public List<Document> getGameData() {
        List<Document> docs = new ArrayList<>();
        Random random = new Random();
        Set<Integer> usedScores = new HashSet<>();
        
        for (int i = 0; i < 10; i++) {
            String title = sampleTitles[random.nextInt(sampleTitles.length)] + " " + (i + 1);
            String author = sampleAuthors[random.nextInt(sampleAuthors.length)];
            int score;
            do {
                score = random.nextInt(90) + 10;
            } while (usedScores.contains(score));
            usedScores.add(score);
            docs.add(new Document(title, author, score));
        }
        
        return docs;
    }

    private List<Document> generateRandomDocuments(int count) {
        List<Document> docs = new ArrayList<>();
        Random random = new Random();
        
        for (int i = 0; i < count; i++) {
            String title = sampleTitles[random.nextInt(sampleTitles.length)] + " " + (i + 1);
            String author = sampleAuthors[random.nextInt(sampleAuthors.length)];
            int score = random.nextInt(100) + 1;
            docs.add(new Document(title, author, score));
        }
        
        return docs;
    }

    public void saveDocument(Document document) {
        documentDao.save(document);
    }

    public void deleteAllDocuments() {
        documentDao.deleteAll();
    }
}
