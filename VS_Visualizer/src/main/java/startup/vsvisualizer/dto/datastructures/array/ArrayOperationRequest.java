package startup.vsvisualizer.dto.datastructures.array;

import lombok.Data;
import java.util.List;

@Data
public class ArrayOperationRequest {
    private List<Double> array;
    private Double index;
    private Double value;

    private String baseAddress;
    private String selectedType;
    private String listType;
}
