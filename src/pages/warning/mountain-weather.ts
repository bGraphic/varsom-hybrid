import { Component, Input } from "@angular/core";
import { Warning, WarningType } from "../../store/models/Warning";

enum Type {
  RainFall = 10,
  Wind = 20,
  WindDirection = 30,
  Temperature = 40,
  ZeroIsoterm = 50
}

enum SubType {
  RainFallFrom = 70,
  RainFallTo = 60
}

interface MeasurementType {
  Id: number;
  Name: string;
  SortOrder: number;
  MeasurementSubTypes: {
    Id: number;
    Name: string;
    SortOrder: number;
    Value: string;
  }[];
}

interface Weather {
  MeasurementTypes: MeasurementType[];
}

@Component({
  selector: "mountain-weather",
  templateUrl: "mountain-weather.html"
})
export class MountainWeather {
  @Input() weather: Weather;
  measurmentTypeIds: number[];

  ngOnChanges() {
    console.log(this.weather.MeasurementTypes);
    this.measurmentTypeIds = this.weather.MeasurementTypes.filter(
      type => type.Id !== Type.WindDirection
    )
      .filter(
        type =>
          !!type.MeasurementSubTypes && type.MeasurementSubTypes.length > 0
      )
      .sort((a, b) => (a.SortOrder > b.SortOrder ? 1 : -1))
      .map(type => type.Id);
  }

  transformToString(id: number): string {
    let { label, description } = stringFactory[id](
      this.weather.MeasurementTypes
    );

    return `${label}: ${description}`;
  }
}

const stringFactory = {
  [Type.RainFall]: (
    measurementTypes: MeasurementType[]
  ): { label: string; description: string } => {
    const type = findType(measurementTypes, Type.RainFall);
    const from = parseInt(subTypeValue(type, SubType.RainFallFrom));
    const to = parseInt(subTypeValue(type, SubType.RainFallTo));
    let desc = `${from} mm i døgnet, opp mot ${to} mm i mest utsatt område`;

    if (from === 0 && to === 0) {
      desc = `0 mm i døgnet`;
    } else if (to - from < 5) {
      desc = `${from} - ${to} mm i døgnet`;
    }

    return {
      label: type.Name,
      description: desc
    };
  },
  [Type.Wind]: (measurementTypes: MeasurementType[]) => {
    const type = findType(measurementTypes, Type.Wind);
    return {
      label: type.Name,
      description: ""
    };
  },
  [Type.Temperature]: (measurementTypes: MeasurementType[]) => {
    const type = findType(measurementTypes, Type.Temperature);
    return {
      label: type.Name,
      description: ""
    };
  },
  [Type.ZeroIsoterm]: (measurementTypes: MeasurementType[]) => {
    const type = findType(measurementTypes, Type.ZeroIsoterm);
    return {
      label: type.Name,
      description: ""
    };
  }
};

const findType = (measurementTypes: MeasurementType[], typeId: number) => {
  return measurementTypes.find(type => type.Id === typeId);
};

const subTypeValue = (type: MeasurementType, subTypeId: SubType): string => {
  const subType = type.MeasurementSubTypes.find(
    subType => subType.Id == subTypeId
  );

  if (subType) {
    return subType.Value;
  }
};
