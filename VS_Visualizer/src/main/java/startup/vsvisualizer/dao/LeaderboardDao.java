package startup.vsvisualizer.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import startup.vsvisualizer.entity.LeaderboardEntry;

import java.util.List;

@Repository
public interface LeaderboardDao extends CrudRepository<LeaderboardEntry, Integer> {
    List<LeaderboardEntry> findTop10ByOrderByTimeToSortAsc();
    void deleteAll();
}
