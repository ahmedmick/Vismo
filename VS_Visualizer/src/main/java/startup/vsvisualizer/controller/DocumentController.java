package startup.vsvisualizer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import startup.vsvisualizer.entity.Document;
import startup.vsvisualizer.entity.LeaderboardEntry;
import startup.vsvisualizer.service.DocumentService;
import startup.vsvisualizer.service.LeaderboardService;

import java.util.List;

@RestController
@CrossOrigin(origins = "https://visualizer-frontend-production-9da8.up.railway.app", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping("/documents")
    public List<Document> getDocuments() {
        return documentService.getDocuments();
    }

    @GetMapping("/documents/race-data")
    public List<Document> getRaceData(@RequestParam(defaultValue = "50") int count) {
        return documentService.getRaceData(count);
    }

    @GetMapping("/documents/game-data")
    public List<Document> getGameData() {
        return documentService.getGameData();
    }

    @GetMapping("/documents/debug-data")
    public List<Document> getDebugData() {
        return documentService.getDebugData();
    }

    @PostMapping("/leaderboard")
    public LeaderboardEntry saveLeaderboardEntry(@RequestBody LeaderboardEntry entry) {
        return leaderboardService.saveEntry(entry);
    }

    @GetMapping("/leaderboard")
    public List<LeaderboardEntry> getLeaderboard() {
        return leaderboardService.getTop10();
    }

    @DeleteMapping("/leaderboard")
    public void clearLeaderboard() {
        leaderboardService.clearLeaderboard();
    }

    @DeleteMapping("/leaderboard/{id}")
    public void deleteEntry(@PathVariable Integer id) {
        leaderboardService.deleteEntry(id);
    }
}
