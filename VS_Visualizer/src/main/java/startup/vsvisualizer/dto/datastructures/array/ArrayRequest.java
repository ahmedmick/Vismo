package startup.vsvisualizer.dto.datastructures.array;

import lombok.Data;
import startup.vsvisualizer.model.visualization.AlgorithmType;
import java.util.List;

@Data
public class ArrayRequest {
    private List<Double> array;
    private AlgorithmType algorithmType;

}
