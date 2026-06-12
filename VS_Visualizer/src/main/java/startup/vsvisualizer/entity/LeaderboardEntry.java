package startup.vsvisualizer.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "leaderboard")
public class LeaderboardEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String playerName;
    private Integer timeToSort;
    private Integer swapCount;
    private Boolean wonAgainstAI;

    public LeaderboardEntry() {}

    public LeaderboardEntry(String playerName, Integer timeToSort, Integer swapCount, Boolean wonAgainstAI) {
        this.playerName = playerName;
        this.timeToSort = timeToSort;
        this.swapCount = swapCount;
        this.wonAgainstAI = wonAgainstAI;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public Integer getTimeToSort() {
        return timeToSort;
    }

    public void setTimeToSort(Integer timeToSort) {
        this.timeToSort = timeToSort;
    }

    public Integer getSwapCount() {
        return swapCount;
    }

    public void setSwapCount(Integer swapCount) {
        this.swapCount = swapCount;
    }

    public Boolean getWonAgainstAI() {
        return wonAgainstAI;
    }

    public void setWonAgainstAI(Boolean wonAgainstAI) {
        this.wonAgainstAI = wonAgainstAI;
    }
}
