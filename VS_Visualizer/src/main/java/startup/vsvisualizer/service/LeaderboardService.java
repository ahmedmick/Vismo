package startup.vsvisualizer.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import startup.vsvisualizer.dao.LeaderboardDao;
import startup.vsvisualizer.entity.LeaderboardEntry;

import java.util.ArrayList;
import java.util.List;

@Service
public class LeaderboardService {

    @Autowired
    private LeaderboardDao leaderboardDao;

    public List<LeaderboardEntry> getTop10() {
        List<LeaderboardEntry> entries = new ArrayList<>();
        leaderboardDao.findTop10ByOrderByTimeToSortAsc().forEach(entries::add);
        return entries;
    }

    public LeaderboardEntry saveEntry(LeaderboardEntry entry) {
        return leaderboardDao.save(entry);
    }

    public void clearLeaderboard() {
        leaderboardDao.deleteAll();
    }

    public void deleteEntry(Integer id) {
        leaderboardDao.deleteById(id);
    }
}
